import os
import uuid
from unittest import mock

from django.test import TestCase

from .. import tasks
from ..models import OutboxJob, OutreachStatus, ProspectContact, SalesExecutiveProfile
from ..services import crm_sync
from .helpers import make_campaign, make_contact, make_user

SYNC_ON = {"EMPFLY_CRM_SYNC_ENABLED": "1", "EMPFLY_CRM_LEAD_SOURCE_ID": "4"}


def fake_crm():
    client = mock.Mock()
    client.search_companies.return_value = []
    client.search_leads.return_value = []
    client.create_company.return_value = {"id": 11}
    client.create_lead.return_value = {"id": 22}
    client.create_task.return_value = {"id": 33}
    return client


@mock.patch.dict(os.environ, SYNC_ON)
class CrmSyncTests(TestCase):
    def setUp(self):
        self.exec_user = make_user("ravi")
        self.exec_uuid = uuid.uuid4()
        SalesExecutiveProfile.objects.create(user=self.exec_user, empfly_user_uuid=self.exec_uuid,
                                             empfly_name="Ravi", empfly_email="ravi@ee.com")
        self.contact = make_contact(campaign=make_campaign(), assigned_to=self.exec_user,
                                    outreach_status=OutreachStatus.POSITIVE_REPLY,
                                    reply_category="Interested", last_reply_text="Call me")

    def test_creates_company_lead_note_and_assigned_task(self):
        client = fake_crm()
        result = crm_sync.sync_contact(self.contact, client=client)
        self.assertEqual(result, {"crm_company_id": "11", "crm_lead_id": "22",
                                  "crm_task_id": "33", "assigned": True})

        lead = client.create_lead.call_args.args[0]
        self.assertEqual(lead["email"], "asha@acme.com")
        self.assertEqual(lead["company_id"], 11)
        self.assertEqual(lead["lead_source_id"], 4)
        self.assertEqual(lead["assigned_to_uuid"], str(self.exec_uuid))
        self.assertEqual(lead["lead_status"], "pre_qualified")
        self.assertNotIn("custom_fields", lead)  # off until the CRM defines the keys
        task = client.create_task.call_args.args[0]
        self.assertEqual(task["assignees"], [str(self.exec_uuid)])
        self.assertIn("Asha Rao", task["name"])
        note_models = [c.args[0] for c in client.add_note.call_args_list]
        self.assertEqual(note_models, ["lead", "task"])

        self.contact.refresh_from_db()
        self.assertEqual(self.contact.crm_sync_status, ProspectContact.CrmSync.SYNCED)
        self.assertIsNotNone(self.contact.next_follow_up_date)

    def test_existing_crm_records_are_reused(self):
        client = fake_crm()
        client.search_companies.return_value = [{"id": 5, "full_name": "ACME PVT LTD"}]
        client.search_leads.return_value = [{"id": 6, "email": "asha@acme.com"}]
        crm_sync.sync_contact(self.contact, client=client)
        client.create_company.assert_not_called()
        client.create_lead.assert_not_called()
        client.update_lead.assert_called_once()
        self.assertEqual(self.contact.crm_lead_id, "6")

    def test_retry_after_partial_failure_creates_no_duplicates(self):
        client = fake_crm()
        client.create_task.side_effect = [RuntimeError("CRM down"), {"id": 33}]
        job = crm_sync.queue_crm_sync(self.contact)
        with mock.patch.object(crm_sync, "EmpflyCrmClient", return_value=client):
            self.assertEqual(tasks.run_job(job), OutboxJob.Status.PENDING)
            job.next_attempt_at = job.created_at
            job.save()
            self.assertEqual(tasks.run_pending_jobs(), {"done": 1, "pending": 0, "failed": 0})
        self.assertEqual(client.create_company.call_count, 1)
        self.assertEqual(client.create_lead.call_count, 1)
        self.assertEqual(client.create_task.call_count, 2)
        lead_notes = [c for c in client.add_note.call_args_list if c.args[0] == "lead"]
        self.assertEqual(len(lead_notes), 1)

    def test_disabled_sync_waits_without_using_attempts(self):
        job = crm_sync.queue_crm_sync(self.contact)
        with mock.patch.dict(os.environ, {"EMPFLY_CRM_SYNC_ENABLED": ""}):
            self.assertEqual(tasks.run_job(job), OutboxJob.Status.PENDING)
        self.assertEqual(job.attempts, 0)
        self.assertIn("EMPFLY_CRM_SYNC_ENABLED", job.last_error)

    def test_gives_up_after_max_attempts(self):
        client = fake_crm()
        client.create_company.side_effect = RuntimeError("CRM down")
        job = crm_sync.queue_crm_sync(self.contact)
        job.max_attempts = 1
        with mock.patch.object(crm_sync, "EmpflyCrmClient", return_value=client):
            self.assertEqual(tasks.run_job(job), OutboxJob.Status.FAILED)
        self.contact.refresh_from_db()
        self.assertEqual(self.contact.crm_sync_status, ProspectContact.CrmSync.FAILED)
        self.assertIn("CRM down", self.contact.crm_sync_error)

    def test_queue_is_deduplicated(self):
        first = crm_sync.queue_crm_sync(self.contact)
        self.assertEqual(crm_sync.queue_crm_sync(self.contact), first)
