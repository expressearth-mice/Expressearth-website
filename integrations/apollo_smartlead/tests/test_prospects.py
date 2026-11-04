import os
from unittest import mock

from django.test import TestCase

from ..models import ApiCallLog, ProspectCompany, ProspectContact, ProspectSearch
from ..services import contact_enrichment, prospect_search
from .helpers import KEYS, REQUEST, fake_response, make_contact, make_user

ORG = {"id": "org-9", "name": "Bharat Motors", "primary_domain": "bharatmotors.in",
       "website_url": "http://www.bharatmotors.in", "industry": "automotive",
       "estimated_num_employees": 800, "city": "Noida", "state": "Uttar Pradesh",
       "country": "India"}
PERSON = {"id": "person-9", "first_name": "Ravi", "last_name_obfuscated": "K***",
          "title": "Chief People Officer", "seniority": "c_suite", "has_email": True,
          "organization_id": "org-9", "organization": {"name": "Bharat Motors"}}


@mock.patch.dict(os.environ, KEYS)
class CompanySearchTests(TestCase):
    def setUp(self):
        self.user = make_user("manager")

    def test_upserts_companies_without_duplicates(self):
        data = {"organizations": [ORG], "pagination": {"total_entries": 1}}
        with mock.patch(REQUEST, return_value=fake_response(data=data)) as request:
            prospect_search.search_companies(user=self.user, industry_keywords=["automotive"],
                                             ncr=True, employee_ranges=["501,1000"])
            prospect_search.search_companies(user=self.user, industry_keywords=["automotive"])
        company = ProspectCompany.objects.get()
        self.assertEqual(company.domain, "bharatmotors.in")
        self.assertTrue(company.is_ncr)
        self.assertEqual(company.employee_range, "501-1000")
        sent = request.call_args_list[0].kwargs["json"]
        self.assertIn("Gurugram, India", sent["organization_locations"])
        self.assertEqual(ProspectSearch.objects.count(), 2)

    def test_requires_a_filter(self):
        with self.assertRaises(ValueError):
            prospect_search.search_companies(user=self.user)


@mock.patch.dict(os.environ, KEYS)
class PeopleSearchTests(TestCase):
    def test_links_people_to_selected_company(self):
        user = make_user("manager")
        company = prospect_search.upsert_company(ORG)
        with mock.patch(REQUEST, return_value=fake_response(data={"people": [PERSON]})) as request:
            contacts, _ = prospect_search.search_people(user=user, company_ids=[company.pk],
                                                        titles=["HR Head"])
        self.assertEqual(request.call_args.kwargs["json"]["organization_ids"], ["org-9"])
        contact = contacts[0]
        self.assertEqual(contact.company, company)
        self.assertEqual(contact.last_name, "K***")
        self.assertTrue(contact.has_email)
        self.assertIsNone(contact.email)  # search never reveals emails


@mock.patch.dict(os.environ, {**KEYS, "APOLLO_DAILY_CREDIT_LIMIT": "100"})
class EnrichmentTests(TestCase):
    def setUp(self):
        self.user = make_user("manager")
        self.contact = make_contact(email=None, email_status=ProspectContact.EmailStatus.UNKNOWN,
                                    last_name="R***")

    def test_applies_match_and_rescores(self):
        match = {"id": "person-1", "first_name": "Asha", "last_name": "Rao",
                 "email": "Asha.Rao@acme.com", "email_status": "verified", "title": "Head of HR"}
        data = {"matches": [match], "credits_consumed": 1}
        with mock.patch(REQUEST, return_value=fake_response(data=data)):
            summary = contact_enrichment.enrich_contacts([self.contact], user=self.user)
        self.contact.refresh_from_db()
        self.assertEqual(summary["enriched"], 1)
        self.assertEqual(self.contact.email, "asha.rao@acme.com")
        self.assertEqual(self.contact.last_name, "Rao")
        self.assertEqual(self.contact.email_status, ProspectContact.EmailStatus.VERIFIED)
        self.assertGreater(self.contact.lead_score, 50)

    def test_already_enriched_contacts_are_skipped(self):
        self.contact.enriched_at = self.contact.created_at
        self.contact.save()
        with mock.patch(REQUEST) as request:
            summary = contact_enrichment.enrich_contacts([self.contact], user=self.user)
        request.assert_not_called()
        self.assertEqual(summary["skipped_already_enriched"], 1)

    def test_daily_credit_limit_blocks_before_calling_apollo(self):
        ApiCallLog.objects.create(provider="apollo", method="POST", endpoint="people/bulk_match",
                                  ok=True, credits_consumed=100)
        with mock.patch(REQUEST) as request:
            with self.assertRaises(contact_enrichment.CreditLimitReached):
                contact_enrichment.enrich_contacts([self.contact], user=self.user)
        request.assert_not_called()

    def test_duplicate_email_rejects_the_new_contact(self):
        original = make_contact(company=self.contact.company, first_name="A", email="dup@acme.com",
                                apollo_contact_id="person-0")
        data = {"matches": [{"id": "person-1", "email": "dup@acme.com",
                             "email_status": "verified"}]}
        with mock.patch(REQUEST, return_value=fake_response(data=data)):
            contact_enrichment.enrich_contacts([self.contact], user=self.user)
        self.contact.refresh_from_db()
        self.assertEqual(self.contact.approval_status, ProspectContact.Approval.REJECTED)
        self.assertIn(f"#{original.pk}", self.contact.rejection_reason)

    def test_phone_webhook_payload_sets_best_number(self):
        payload = {"people": [{"id": "person-1", "phone_numbers": [
            {"sanitized_number": "+911111111111", "type_cd": "work_hq", "status_cd": "valid_number"},
            {"sanitized_number": "+919999999999", "type_cd": "mobile", "status_cd": "valid_number"},
        ]}]}
        self.assertEqual(contact_enrichment.apply_phone_webhook(payload), 1)
        self.contact.refresh_from_db()
        self.assertEqual(self.contact.phone, "+919999999999")
