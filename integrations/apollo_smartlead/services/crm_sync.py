"""Push an interested contact into EmpFly CRM: company -> lead -> note -> task.

Each created CRM id is saved on the contact straight away, and finished steps
are recorded on the job, so a retry after a partial failure never creates
duplicates. Runs from the outbox (``tasks.py``) or the manual "Sync to CRM".
"""
from datetime import timedelta

from django.utils import timezone

from .. import conf
from ..clients import EmpflyCrmClient
from ..models import OutboxJob, ProspectContact


class SyncDisabled(Exception):
    pass


def next_business_day(start=None):
    day = (start or timezone.localdate()) + timedelta(days=1)
    while day.weekday() >= 5:  # Sat/Sun
        day += timedelta(days=1)
    return day


def queue_crm_sync(contact, reason="positive_reply"):
    """Queue (once) a CRM sync for ``contact``; returns the pending job."""
    job = OutboxJob.objects.filter(
        kind=OutboxJob.Kind.CRM_SYNC, contact=contact,
        status__in=[OutboxJob.Status.PENDING, OutboxJob.Status.RUNNING],
    ).first()
    if job is None:
        job = OutboxJob.objects.create(kind=OutboxJob.Kind.CRM_SYNC, contact=contact,
                                       payload={"reason": reason})
    contact.crm_sync_status = ProspectContact.CrmSync.QUEUED
    contact.save(update_fields=["crm_sync_status", "updated_at"])
    return job


def _assignee(contact):
    profile = getattr(contact.assigned_to, "leadgen_profile", None) if contact.assigned_to else None
    if profile and profile.is_active:
        return profile
    return None


def _ids_text(contact):
    campaign = contact.campaign
    return (f"Apollo contact: {contact.apollo_contact_id or '-'}; "
            f"Apollo org: {getattr(contact.company, 'apollo_organization_id', None) or '-'}; "
            f"Smartlead campaign: {campaign.smartlead_campaign_id if campaign else '-'}; "
            f"Lead score: {contact.lead_score}")


def _custom_fields(contact):
    if not conf.empfly_crm_use_custom_fields():
        return {}
    campaign = contact.campaign
    return {"custom_fields": {
        "apollo_contact_id": contact.apollo_contact_id or "",
        "apollo_organization_id": getattr(contact.company, "apollo_organization_id", "") or "",
        "smartlead_campaign_id": str(campaign.smartlead_campaign_id) if campaign else "",
        "lead_score": contact.lead_score,
    }}


def _lead_source():
    source = conf.empfly_crm_lead_source_id()
    return {"lead_source_id": int(source)} if source.isdigit() else {}


def ensure_company(client, contact):
    company = contact.company
    if contact.crm_company_id or not company:
        return contact.crm_company_id
    name = company.name.strip().lower()
    for row in client.search_companies(company.name):
        if (row.get("full_name") or "").strip().lower() == name:
            return str(row["id"])
    created = client.create_company({
        "full_name": company.name,
        "website": company.website or (company.domain or ""),
        "city_name": company.city,
        "description": f"Added from ExpressEarth lead generation. {_ids_text(contact)}",
        **_lead_source(),
        **({"custom_fields": {"apollo_organization_id": company.apollo_organization_id or ""}}
           if conf.empfly_crm_use_custom_fields() else {}),
    })
    return str(created["id"])


def _lead_fields(contact, assignee):
    fields = {"lead_status": conf.empfly_crm_positive_status()}
    if assignee:
        fields.update({"assigned_to_uuid": str(assignee.empfly_user_uuid),
                       "assigned_to_name": assignee.empfly_name,
                       "assigned_to_email": assignee.empfly_email})
    return fields


def ensure_lead(client, contact, assignee):
    if contact.crm_lead_id:
        client.update_lead(contact.crm_lead_id, _lead_fields(contact, assignee))
        return contact.crm_lead_id
    for row in client.search_leads(contact.email):
        if (row.get("email") or "").lower() == contact.email:
            client.update_lead(row["id"], _lead_fields(contact, assignee))
            return str(row["id"])
    company = contact.company
    created = client.create_lead({
        "first_name": contact.first_name or contact.email,
        "last_name": contact.last_name,
        "title": contact.designation,
        "email": contact.email,
        "phone": contact.phone,
        "company_name": company.name if company else "",
        "website": company.website if company else "",
        "city_name": company.city if company else "",
        "description": f"Interested reply via Smartlead. {_ids_text(contact)}",
        **({"company_id": int(contact.crm_company_id)} if contact.crm_company_id.isdigit() else {}),
        **_lead_source(),
        **_custom_fields(contact),
        **_lead_fields(contact, assignee),
    })
    return str(created["id"])


def sync_contact(contact, job=None, client=None):
    """Run the CRM sync for one contact. Raises on failure (the caller retries)."""
    if not conf.empfly_crm_sync_enabled():
        raise SyncDisabled("EmpFly CRM sync is disabled (EMPFLY_CRM_SYNC_ENABLED is off).")
    if not contact.email:
        raise ValueError("Contact has no email; nothing to sync.")
    client = client or EmpflyCrmClient()
    steps = job.payload.setdefault("done", []) if job else []

    def mark(step):
        if job is not None:
            steps.append(step)
            job.save(update_fields=["payload", "updated_at"])

    contact.crm_company_id = ensure_company(client, contact) or ""
    contact.save(update_fields=["crm_company_id", "updated_at"])

    assignee = _assignee(contact)
    contact.crm_lead_id = ensure_lead(client, contact, assignee)
    contact.save(update_fields=["crm_lead_id", "updated_at"])

    if "note" not in steps:
        reply = (contact.last_reply_text or "").strip()[:3000]
        client.add_note("lead", contact.crm_lead_id,
                        f"Smartlead reply ({contact.reply_category or 'reply'}) "
                        f"in campaign '{contact.campaign or '-'}':\n{reply or '(no text)'}\n\n"
                        f"{_ids_text(contact)}")
        mark("note")

    company = contact.company.name if contact.company else "-"
    if not contact.crm_task_id:
        contact.next_follow_up_date = contact.next_follow_up_date or next_business_day()
        task = client.create_task({
            "name": f"Follow up: {contact.full_name} ({company})"[:250],
            "due_date": contact.next_follow_up_date.isoformat(),
            **({"assignees": [str(assignee.empfly_user_uuid)]} if assignee else {}),
        })
        contact.crm_task_id = str(task["id"])
        contact.save(update_fields=["crm_task_id", "next_follow_up_date", "updated_at"])
    if "task_note" not in steps:
        # Tasks can't link to a lead in the CRM, so the details go in a task note.
        client.add_note("task", contact.crm_task_id,
                        f"Lead: {contact.full_name}, {contact.designation} at {company}\n"
                        f"Email: {contact.email}  Phone: {contact.phone or '-'}\n"
                        f"CRM lead #{contact.crm_lead_id}. {_ids_text(contact)}")
        mark("task_note")

    contact.crm_sync_status = ProspectContact.CrmSync.SYNCED
    contact.crm_sync_error = "" if assignee else "Synced without an assignee (no EmpFly profile)."
    contact.crm_synced_at = timezone.now()
    contact.save(update_fields=["crm_sync_status", "crm_sync_error", "crm_synced_at",
                                "updated_at"])
    return {"crm_company_id": contact.crm_company_id, "crm_lead_id": contact.crm_lead_id,
            "crm_task_id": contact.crm_task_id, "assigned": bool(assignee)}
