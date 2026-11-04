"""Apollo discovery: companies first, then decision-makers at chosen companies.

Neither step reveals emails or phone numbers -- that is the separate, paid
enrichment step in ``contact_enrichment.py``.
"""
from ..clients import ApolloClient
from ..models import ProspectCompany, ProspectContact, ProspectSearch, normalize_domain
from .lead_qualification import find_duplicate, is_ncr, rescore

# Apollo location strings for Delhi NCR, used when the manager picks "NCR".
NCR_APOLLO_LOCATIONS = ["Delhi, India", "Gurugram, India", "Noida, India", "Faridabad, India",
                        "Ghaziabad, India"]

_EMPLOYEE_BUCKETS = ((10, "1-10"), (50, "11-50"), (200, "51-200"), (500, "201-500"),
                     (1000, "501-1000"), (5000, "1001-5000"), (10000, "5001-10000"))

# Only these Apollo organisation keys are kept in ``ProspectCompany.raw``.
_RAW_ORG_KEYS = ("linkedin_url", "phone", "founded_year", "keywords", "raw_address",
                 "short_description", "annual_revenue_printed")


def employee_range_label(count):
    if not count:
        return ""
    for limit, label in _EMPLOYEE_BUCKETS:
        if count <= limit:
            return label
    return "10001+"


def _truthy(value):
    return value not in (None, False, "", "no", "No", "false", 0)


def _compact(filters):
    return {key: value for key, value in filters.items() if value not in (None, "", [], {})}


def _set_unique(instance, field, value):
    """Set a unique field unless another row already owns that value."""
    if not value or getattr(instance, field) == value:
        return
    taken = type(instance).objects.filter(**{field: value}).exclude(pk=instance.pk).exists()
    if not taken:
        setattr(instance, field, value)


def upsert_company(org):
    """Create or refresh a ``ProspectCompany`` from an Apollo organisation dict."""
    apollo_id = org.get("id") or org.get("organization_id")
    domain = normalize_domain(org.get("primary_domain") or org.get("website_url"))
    company = None
    if apollo_id:
        company = ProspectCompany.objects.filter(apollo_organization_id=apollo_id).first()
    if company is None and domain:
        company = ProspectCompany.objects.filter(domain=domain).first()
    company = company or ProspectCompany()

    company.name = org.get("name") or company.name or domain or "Unknown"
    _set_unique(company, "apollo_organization_id", apollo_id)
    _set_unique(company, "domain", domain)
    company.website = org.get("website_url") or company.website
    company.industry = org.get("industry") or company.industry
    company.employee_count = org.get("estimated_num_employees") or company.employee_count
    company.employee_range = employee_range_label(company.employee_count)
    company.city = org.get("city") or company.city
    company.state = org.get("state") or company.state
    company.country = org.get("country") or company.country
    company.is_ncr = is_ncr(company.city, company.state, org.get("raw_address"))
    company.raw = {**company.raw, **{k: org[k] for k in _RAW_ORG_KEYS if org.get(k)}}
    company.save()
    return company


def upsert_contact(person, user=None, company=None):
    """Create or refresh a ``ProspectContact`` from an Apollo person dict."""
    org = person.get("organization") or {}
    org_id = person.get("organization_id") or org.get("id")
    if company is None and org_id:
        company = ProspectCompany.objects.filter(apollo_organization_id=org_id).first()
    if company is None and org.get("name"):
        company = upsert_company({**org, "id": org_id})

    contact = find_duplicate(
        apollo_contact_id=person.get("id"), email=person.get("email"), company=company,
        first_name=person.get("first_name") or "", last_name=person.get("last_name") or "",
    ) or ProspectContact(created_by=user, lead_source="apollo")

    _set_unique(contact, "apollo_contact_id", person.get("id"))
    contact.company = company or contact.company
    contact.first_name = person.get("first_name") or contact.first_name
    # The free search only returns an obfuscated surname; enrichment fills the real one.
    contact.last_name = person.get("last_name") or contact.last_name \
        or person.get("last_name_obfuscated") or ""
    contact.designation = person.get("title") or contact.designation
    contact.seniority = person.get("seniority") or contact.seniority
    contact.linkedin_url = person.get("linkedin_url") or contact.linkedin_url
    contact.has_email = contact.has_email or _truthy(person.get("has_email"))
    contact.has_phone = contact.has_phone or _truthy(person.get("has_direct_phone"))
    rescore(contact, save=False)
    contact.save()
    return contact


def search_companies(*, user, industry_keywords=None, locations=None, ncr=False,
                     employee_ranges=None, page=1, per_page=25):
    """Apollo organisation search (1 credit per page). Returns ``(companies, pagination)``."""
    locations = list(locations or [])
    if ncr:
        locations += [loc for loc in NCR_APOLLO_LOCATIONS if loc not in locations]
    filters = _compact({
        "q_organization_keyword_tags": industry_keywords,
        "organization_locations": locations,
        "organization_num_employees_ranges": employee_ranges,
    })
    if not filters:
        raise ValueError("Provide at least one of industry, location or company size.")
    filters.update({"page": page, "per_page": per_page})

    data = ApolloClient(user).search_companies(filters)
    orgs = list(data.get("organizations") or [])
    # Accounts already saved in Apollo come back separately, keyed by organization_id.
    orgs += [{**acc, "id": acc.get("organization_id") or acc.get("id")}
             for acc in data.get("accounts") or []]
    companies = [upsert_company(org) for org in orgs if org.get("name")]

    pagination = data.get("pagination") or {}
    ProspectSearch.objects.create(
        kind=ProspectSearch.Kind.COMPANY, filters=filters, result_count=len(companies),
        total_available=pagination.get("total_entries"), created_by=user,
    )
    return companies, {"page": page, "per_page": per_page,
                       "total_entries": pagination.get("total_entries")}


def search_people(*, user, company_ids=None, titles=None, seniorities=None,
                  person_locations=None, page=1, per_page=25):
    """Apollo people search at the chosen companies (no credits). Returns ``(contacts, pagination)``."""
    companies = list(ProspectCompany.objects.filter(pk__in=company_ids or []))
    filters = _compact({
        "organization_ids": [c.apollo_organization_id for c in companies
                             if c.apollo_organization_id],
        "q_organization_domains_list": [c.domain for c in companies
                                        if c.domain and not c.apollo_organization_id],
        "person_titles": titles,
        "person_seniorities": seniorities,
        "person_locations": person_locations,
    })
    if not (filters.get("organization_ids") or filters.get("q_organization_domains_list")
            or filters.get("person_titles") or filters.get("person_seniorities")):
        raise ValueError("Pick at least one company, designation or seniority.")
    if titles:
        filters["include_similar_titles"] = True
    filters.update({"page": page, "per_page": per_page})

    data = ApolloClient(user).search_people(filters)
    by_org = {c.apollo_organization_id: c for c in companies if c.apollo_organization_id}
    contacts = []
    for person in data.get("people") or []:
        org_id = person.get("organization_id") or (person.get("organization") or {}).get("id")
        contacts.append(upsert_contact(person, user=user, company=by_org.get(org_id)))

    total = data.get("total_entries") or (data.get("pagination") or {}).get("total_entries")
    ProspectSearch.objects.create(
        kind=ProspectSearch.Kind.PEOPLE, filters=filters, result_count=len(contacts),
        total_available=total, created_by=user,
    )
    return contacts, {"page": page, "per_page": per_page, "total_entries": total}
