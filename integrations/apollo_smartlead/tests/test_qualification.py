from django.test import SimpleTestCase, TestCase

from ..models import OutreachStatus, ProspectContact, SuppressionEntry, normalize_domain
from ..services.lead_qualification import (
    _has_word,
    approval_blockers,
    enrollment_blockers,
    find_duplicate,
    score_contact,
)
from .helpers import make_campaign, make_company, make_contact


class NormalisationTests(SimpleTestCase):
    def test_normalize_domain(self):
        self.assertEqual(normalize_domain("https://www.Acme.com/about?x=1"), "acme.com")
        self.assertEqual(normalize_domain("acme.co.in"), "acme.co.in")
        self.assertIsNone(normalize_domain(""))

    def test_title_matching(self):
        self.assertTrue(_has_word("VP, Sales", ("vp",)))
        self.assertTrue(_has_word("Head - HR", ("hr",)))
        self.assertTrue(_has_word("Administration Manager", ("admin",)))
        self.assertFalse(_has_word("Chrome Developer", ("hr",)))


class ScoringTests(TestCase):
    def test_ideal_lead_scores_100(self):
        contact = make_contact(phone="+919999999999")
        score, breakdown = score_contact(contact)
        self.assertEqual(score, 100, breakdown)

    def test_unverified_non_ncr_junior_scores_low(self):
        company = make_company(name="Far Co", domain="far.com", apollo_organization_id="org-2",
                               is_ncr=False, employee_count=5)
        contact = make_contact(company=company, designation="Coordinator", email="x@far.com",
                               email_status=ProspectContact.EmailStatus.UNVERIFIED,
                               apollo_contact_id="p-2")
        self.assertEqual(score_contact(contact)[0], 0)


class DedupeTests(TestCase):
    def test_finds_same_person_by_apollo_id_email_or_name(self):
        contact = make_contact()
        self.assertEqual(find_duplicate(apollo_contact_id="person-1"), contact)
        self.assertEqual(find_duplicate(email=" ASHA@acme.com "), contact)
        self.assertEqual(find_duplicate(company=contact.company, first_name="asha",
                                        last_name="RAO"), contact)
        self.assertIsNone(find_duplicate(email="someone@else.com"))


class EligibilityTests(TestCase):
    def test_approval_needs_verified_email(self):
        contact = make_contact(email=None, email_status=ProspectContact.EmailStatus.UNKNOWN)
        self.assertIn("No email yet", approval_blockers(contact)[0])
        contact.email, contact.email_status = "a@acme.com", ProspectContact.EmailStatus.UNVERIFIED
        self.assertIn("not verified", approval_blockers(contact)[0])

    def test_domain_suppression_blocks_approval(self):
        contact = make_contact()
        SuppressionEntry.objects.create(domain="https://www.acme.com",
                                        reason=SuppressionEntry.Reason.EXISTING_CLIENT)
        self.assertEqual(contact.suppression_reason, "existing_client")
        self.assertTrue(approval_blockers(contact))

    def test_cannot_enroll_while_active_in_another_campaign(self):
        other = make_campaign(name="Other", smartlead_campaign_id=202)
        contact = make_contact(approval_status=ProspectContact.Approval.APPROVED, campaign=other,
                               outreach_status=OutreachStatus.SENT)
        reasons = enrollment_blockers(contact, make_campaign())
        self.assertTrue(any("Already active" in r for r in reasons))
