export const buildContactRequirements = ({
  projectStage = "",
  requirements = "",
} = {}) => {
  const stage = typeof projectStage === "string" ? projectStage.trim() : "";
  const notes = typeof requirements === "string" ? requirements.trim() : "";
  const sections = [];

  if (stage) sections.push(`Planning stage: ${stage}`);
  if (notes) sections.push(notes);

  return sections.join("\n\n");
};
