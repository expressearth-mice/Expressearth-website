const PROGRAMME_DETAILS = new Set([
  "Incentive Travel",
  "Dealer & Distributor Meet",
  "Corporate Offsite",
  "Conference Management",
  "Corporate Event / Product Launch",
  "Employee & Family Day",
  "Rewards & Recognition",
  "Exhibition / Trade Show",
  "International Group Travel",
  "Destination Management",
  "Not sure yet",
]);

export const buildContactRequirements = ({
  programmeDetail = "",
  projectStage = "",
  requirements = "",
} = {}) => {
  const detail =
    typeof programmeDetail === "string" ? programmeDetail.trim() : "";
  const stage = typeof projectStage === "string" ? projectStage.trim() : "";
  const notes = typeof requirements === "string" ? requirements.trim() : "";
  const sections = [];

  if (PROGRAMME_DETAILS.has(detail)) sections.push(`Programme detail: ${detail}`);
  if (stage) sections.push(`Planning stage: ${stage}`);
  if (notes) sections.push(notes);

  return sections.join("\n\n");
};

const CONTACT_FORM_PREFILLS = Object.freeze({
  corporate_mice: { event_type: "Other", programme_detail: "Not sure yet" },
  incentive_travel: { event_type: "Incentive Trip", programme_detail: "Incentive Travel" },
  dealer_meet: { event_type: "Other", programme_detail: "Dealer & Distributor Meet" },
  corporate_offsite: { event_type: "Other", programme_detail: "Corporate Offsite" },
  conference_management: { event_type: "Conference", programme_detail: "Conference Management" },
  corporate_events: { event_type: "Product Launch", programme_detail: "Corporate Event / Product Launch" },
  family_day_events: { event_type: "Other", programme_detail: "Employee & Family Day" },
  recognition_rewards: { event_type: "Other", programme_detail: "Rewards & Recognition" },
  exhibitions: { event_type: "Exhibition", programme_detail: "Exhibition / Trade Show" },
  international_group_travel: { event_type: "Other", programme_detail: "International Group Travel" },
  destination_management: { event_type: "Other", programme_detail: "Destination Management" },
});

export const getContactFormPrefill = (search = "") => {
  if (typeof search !== "string") return {};

  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const service = (params.get("service") || "").trim().toLowerCase();

  if (!Object.prototype.hasOwnProperty.call(CONTACT_FORM_PREFILLS, service)) {
    return {};
  }

  return { ...CONTACT_FORM_PREFILLS[service] };
};


const CONTACT_FORM_SOURCE_PAGES = Object.freeze({
  corporate_mice: "/mice-services",
  incentive_travel: "/incentive-travel",
  conference_management: "/meetings-and-conferences",
  corporate_events: "/corporate-events",
  family_day_events: "/family-day-events",
});

export const getContactFormSourcePage = (search = "") => {
  if (typeof search !== "string") return "";

  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const service = (params.get("service") || "").trim().toLowerCase();

  if (!Object.prototype.hasOwnProperty.call(CONTACT_FORM_SOURCE_PAGES, service)) {
    return "";
  }

  return CONTACT_FORM_SOURCE_PAGES[service];
};
