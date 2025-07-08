export function extractArray<T>(payload: any): T[] {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.results)) return payload.results;
  console.warn('API: payload is not array or paginated, returning empty array', payload);
  return [];
}