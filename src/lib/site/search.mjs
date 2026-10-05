/** PT05 local title/summary search; PT09 will supply the full indexed engine. */
export const normalizeQuery = value => String(value).slice(0, 200).normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase().trim();
export function matchesQuery(text, query) {
  const haystack = String(text).normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase();
  return normalizeQuery(query).split(/\s+/).filter(Boolean).every(word => haystack.includes(word));
}
