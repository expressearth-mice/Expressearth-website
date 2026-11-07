/**
 * Normalise API collection payloads used by public listing pages.
 * Supports plain arrays and Django REST Framework-style { results: [] } payloads.
 */
export const normalizeCollectionResponse = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
};
