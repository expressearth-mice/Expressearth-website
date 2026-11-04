"""Scoring, deduplication and the eligibility rules for approval/enrollment."""
import re

from ..models import ACTIVE_OUTREACH, NCR_LOCATIONS, ProspectContact, normalize_email

# Points out of 100. Tuned for ExpressEarth's MICE / corporate-travel buyers.
WEIGHTS = {
    "decision_maker": 30,
    "relevant_function": 15,
    "company_size": 15,
    "ncr": 15,
    "email_verified": 20,
    "phone": 5,
}

DECISION_MAKER_SENIORITIES = {"owner", "founder", "c_suite", "partner", "vp", "head", "director"}
DECISION_MAKER_TITLE_WORDS = ("chief", "ceo", "cfo", "coo", "chro", "founder", "president",
                              "director", "head", "vp", "vice president", "partner")
# Functions that buy events, offsites and incentive travel.
RELEVANT_FUNCTION_WORDS = ("hr", "human resource", "people", "admin", "travel", "event",
                           "marketing", "sales", "procurement", "purchase", "talent", "culture")
TARGET_EMPLOYEES = (50, 10000)

# Email statuses safe to send to.
SENDABLE_EMAIL_STATUSES = (ProspectContact.EmailStatus.VERIFIED,)


def is_ncr(*parts):
    text = " ".join(p for p in parts if p).lower()
    return any(city in text for city in NCR_LOCATIONS)


def _has_word(text, words):
    # Short words ("hr", "vp") must match whole; longer ones may be a prefix
    # ("admin" matches "administration").
    padded = " " + re.sub(r"[^a-z0-9]+", " ", text.lower()) + " "
    return any(f" {w} " in padded or (len(w) > 3 and f" {w}" in padded) for w in words)


def score_contact(contact):
    """Return ``(score, breakdown)``; breakdown maps each rule to points earned."""
    title = contact.designation or ""
    company = contact.company
    breakdown = {
        "decision_maker": WEIGHTS["decision_maker"] if (
            contact.seniority in DECISION_MAKER_SENIORITIES
            or _has_word(title, DECISION_MAKER_TITLE_WORDS)
        ) else 0,
        "relevant_function": WEIGHTS["relevant_function"]
        if _has_word(title, RELEVANT_FUNCTION_WORDS) else 0,
        "company_size": WEIGHTS["company_size"] if (
            company and company.employee_count
            and TARGET_EMPLOYEES[0] <= company.employee_count <= TARGET_EMPLOYEES[1]
        ) else 0,
        "ncr": WEIGHTS["ncr"] if company and company.is_ncr else 0,
        "email_verified": WEIGHTS["email_verified"]
        if contact.email_status in SENDABLE_EMAIL_STATUSES else 0,
        "phone": WEIGHTS["phone"] if contact.phone else 0,
    }
    return sum(breakdown.values()), breakdown


def rescore(contact, save=True):
    contact.lead_score, contact.score_breakdown = score_contact(contact)
    if save:
        contact.save(update_fields=["lead_score", "score_breakdown", "updated_at"])
    return contact.lead_score


def find_duplicate(apollo_contact_id=None, email=None, company=None, first_name="", last_name=""):
    """Existing contact that is the same person, by Apollo id, email, or name at company."""
    if apollo_contact_id:
        match = ProspectContact.objects.filter(apollo_contact_id=apollo_contact_id).first()
        if match:
            return match
    email = normalize_email(email)
    if email:
        match = ProspectContact.objects.filter(email=email).first()
        if match:
            return match
    if company and first_name:
        return ProspectContact.objects.filter(
            company=company, first_name__iexact=first_name, last_name__iexact=last_name or "",
        ).first()
    return None


def approval_blockers(contact):
    """Reasons a contact cannot be approved for outreach (empty list = OK)."""
    reasons = []
    if not contact.email:
        reasons.append("No email yet: enrich the contact first.")
    elif contact.email_status not in SENDABLE_EMAIL_STATUSES:
        reasons.append(f"Email status is '{contact.email_status}', not verified.")
    suppression = contact.suppression_reason
    if suppression:
        reasons.append(f"Suppressed ({suppression}).")
    return reasons


def enrollment_blockers(contact, campaign):
    """Reasons a contact cannot be enrolled into ``campaign`` (empty list = OK)."""
    reasons = []
    if contact.approval_status != ProspectContact.Approval.APPROVED:
        reasons.append("Not approved.")
    reasons += [r for r in approval_blockers(contact) if r not in reasons]
    if contact.campaign_id and contact.campaign_id != campaign.pk \
            and contact.outreach_status in ACTIVE_OUTREACH:
        reasons.append(f"Already active in campaign '{contact.campaign}'.")
    if contact.enrollments.filter(campaign=campaign).exists():
        reasons.append("Already enrolled in this campaign.")
    return reasons
