import { normalizeCollectionResponse } from "./collectionData";

describe("normalizeCollectionResponse", () => {
  test("returns a plain array unchanged", () => {
    const items = [{ id: 1 }, { id: 2 }];
    expect(normalizeCollectionResponse(items)).toBe(items);
  });

  test("extracts results from a paginated API response", () => {
    const items = [{ id: 1 }, { id: 2 }];
    expect(normalizeCollectionResponse({ count: 2, next: null, results: items })).toEqual(items);
  });

  test("returns an empty array for missing or unsupported payloads", () => {
    expect(normalizeCollectionResponse(null)).toEqual([]);
    expect(normalizeCollectionResponse({ results: null })).toEqual([]);
    expect(normalizeCollectionResponse({ detail: "Not found" })).toEqual([]);
  });
});
