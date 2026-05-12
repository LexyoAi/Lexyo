// In-memory TTL cache for AI-generated educational content.
// Bounded at MAX_ENTRIES to prevent memory leaks; evicts oldest on overflow.
// Resets on cold start — designed for within-session cache hits (school hours).

const MAX_ENTRIES = 400;
const store = new Map();

export function cacheGet(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) { store.delete(key); return null; }
  return entry.value;
}

export function cacheSet(key, value, ttlMs = 3_600_000) {
  if (store.size >= MAX_ENTRIES) store.delete(store.keys().next().value);
  store.set(key, { value, expires: Date.now() + ttlMs });
}

// Returns true if the store has a live (non-expired) entry for key
export function cacheHas(key) {
  return cacheGet(key) !== null;
}

// Normalise parts into a stable cache key string
export function ck(...parts) {
  return parts
    .map(p => String(p ?? "").toLowerCase().trim().replace(/\s+/g, "_"))
    .join(":");
}

// Pick a random element from an array
export function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Append a new variant to a cached array (up to maxVariants), then re-store
export function cacheAddVariant(key, newValue, maxVariants, ttlMs) {
  const existing = cacheGet(key) || [];
  const updated = existing.length >= maxVariants
    ? existing
    : [...existing, newValue];
  cacheSet(key, updated, ttlMs);
  return updated;
}
