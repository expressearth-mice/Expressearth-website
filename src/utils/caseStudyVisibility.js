const PLACEHOLDER_CASE_STUDY_SLUGS = new Set(["abc", "abc-1", "abc-2", "abcd"]);

export const isPlaceholderCaseStudySlug = (value) => {
  const slug = String(value ?? "").trim().toLowerCase();
  return PLACEHOLDER_CASE_STUDY_SLUGS.has(slug);
};

export const isIndexableCaseStudySlug = (value) => {
  const slug = String(value ?? "").trim().toLowerCase();
  return Boolean(slug) && /[a-z]/.test(slug) && !isPlaceholderCaseStudySlug(slug);
};

export const filterPublicCaseStudies = (records) => {
  if (!Array.isArray(records)) return [];

  return records.filter((record) => {
    const slugOrId = record?.slug || record?.id;
    return !isPlaceholderCaseStudySlug(slugOrId);
  });
};
