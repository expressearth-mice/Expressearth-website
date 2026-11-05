const PLACEHOLDER_CASE_STUDY_SLUGS = new Set(["abc", "abc-1", "abc-2", "abcd"]);

const normalizeSlugSet = (values) => {
  if (values instanceof Set) {
    return new Set([...values].map((value) => String(value ?? "").trim().toLowerCase()).filter(Boolean));
  }
  if (!Array.isArray(values)) return new Set();
  return new Set(values.map((value) => String(value ?? "").trim().toLowerCase()).filter(Boolean));
};

export const isPlaceholderCaseStudySlug = (value) => {
  const slug = String(value ?? "").trim().toLowerCase();
  return PLACEHOLDER_CASE_STUDY_SLUGS.has(slug);
};

// Match the sitemap rule: a trailing numeric suffix is a duplicate only when
// the unsuffixed base slug also exists in the combined public case-study data.
export const isNumberedDuplicateCaseStudySlug = (value, availableSlugs = []) => {
  const slug = String(value ?? "").trim().toLowerCase();
  const baseSlug = slug.replace(/-\\d+$/, "");
  if (!slug || baseSlug === slug) return false;
  return normalizeSlugSet(availableSlugs).has(baseSlug);
};

export const isIndexableCaseStudySlug = (value, availableSlugs = []) => {
  const slug = String(value ?? "").trim().toLowerCase();
  return Boolean(slug) &&
    /[a-z]/.test(slug) &&
    !isPlaceholderCaseStudySlug(slug) &&
    !isNumberedDuplicateCaseStudySlug(slug, availableSlugs);
};

export const filterPublicCaseStudies = (records) => {
  if (!Array.isArray(records)) return [];

  const availableSlugs = normalizeSlugSet(records.map((record) => record?.slug));
  const seenSlugs = new Set();

  return records.filter((record) => {
    const slug = String(record?.slug ?? "").trim().toLowerCase();
    const slugOrId = slug || record?.id;

    if (isPlaceholderCaseStudySlug(slugOrId)) return false;
    if (slug && isNumberedDuplicateCaseStudySlug(slug, availableSlugs)) return false;
    if (slug && seenSlugs.has(slug)) return false;

    if (slug) seenSlugs.add(slug);
    return true;
  });
};
