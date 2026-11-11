import {
  filterPublicCaseStudies,
  isIndexableCaseStudySlug,
  isNumberedDuplicateCaseStudySlug,
  isPlaceholderCaseStudySlug,
} from "./caseStudyVisibility";

describe("case study public visibility", () => {
  test.each(["abc", "abc-1", "abc-2", "abcd", " ABC-1 "])(
    "recognises the known placeholder slug %s",
    (slug) => {
      expect(isPlaceholderCaseStudySlug(slug)).toBe(true);
    },
  );

  test("allows a descriptive case study slug to be indexed", () => {
    expect(isIndexableCaseStudySlug("corporate-incentive-programme")).toBe(true);
  });

  test.each(["", null, undefined, "12345", "abc-1"])(
    "does not index a missing, ID-only or placeholder slug: %s",
    (slug) => {
      expect(isIndexableCaseStudySlug(slug)).toBe(false);
    },
  );

  test("matches the sitemap rule for numbered duplicate slugs", () => {
    const availableSlugs = ["dealer-meet-programme", "dealer-meet-programme-2"];
    expect(isNumberedDuplicateCaseStudySlug("dealer-meet-programme-2", availableSlugs)).toBe(true);
    expect(isIndexableCaseStudySlug("dealer-meet-programme-2", availableSlugs)).toBe(false);
    expect(isNumberedDuplicateCaseStudySlug("dealer-meet-programme-2025", ["dealer-meet-programme-2025"])).toBe(false);
    expect(isIndexableCaseStudySlug("dealer-meet-programme-2025", ["dealer-meet-programme-2025"])).toBe(true);
  });

  test("filters placeholders, numbered duplicates and exact duplicates while preserving legacy ID-based entries", () => {
    const records = [
      { id: 1, slug: "dealer-meet-programme" },
      { id: 2, slug: "dealer-meet-programme-2" },
      { id: 3, slug: "dealer-meet-programme" },
      { id: 4, slug: "abc-1" },
      { id: 5, slug: "ABC" },
      { id: 6 },
      { id: 7, slug: "conference-2025" },
    ];

    expect(filterPublicCaseStudies(records)).toEqual([records[0], records[5], records[6]]);
  });

  test("returns an empty list for unsupported collection payloads", () => {
    expect(filterPublicCaseStudies({ results: [] })).toEqual([]);
    expect(filterPublicCaseStudies(null)).toEqual([]);
  });
});
