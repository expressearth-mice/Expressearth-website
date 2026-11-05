const PROGRAMME_DETAILS = new Set([
  "Incentive Travel",
  "Dealer & Distributor Meet",
  "Corporate Offsite",
  "Conference Management",
  "Corporate Event / Product Launch",
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
