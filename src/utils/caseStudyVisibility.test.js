import {
  filterPublicCaseStudies,
  isIndexableCaseStudySlug,
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

  test("filters known placeholders but preserves valid and legacy ID-based entries", () => {
    const records = [
      { id: 1, slug: "dealer-meet-programme" },
      { id: 2, slug: "abc-1" },
      { id: 3, slug: "ABC" },
      { id: 4 },
    ];

    expect(filterPublicCaseStudies(records)).toEqual([records[0], records[3]]);
  });

  test("returns an empty list for unsupported collection payloads", () => {
    expect(filterPublicCaseStudies({ results: [] })).toEqual([]);
    expect(filterPublicCaseStudies(null)).toEqual([]);
  });
});
