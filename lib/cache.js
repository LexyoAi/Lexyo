// In-memory TTL cache for AI-generated educational content.
// Bounded at MAX_ENTRIES to prevent memory leaks; evicts oldest on overflow.
// Resets on cold start — designed for within-session cache hits (school hours).

const MAX_ENTRIES = 400;
const store = new Map();
const pending = new Map(); // request coalescing: key → Promise<value>

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

// Fetch-with-cache + request coalescing + stale-while-revalidate.
//
// Behaviour:
//   - Cache has ≥1 variant  → serve immediately from cache (HIT).
//     If variants < maxVariants and no background fetch is running, kick off a
//     background fetch to grow the pool — caller is NOT blocked.
//   - Cache is empty, fetch in-flight → join the existing Promise (coalescing).
//   - Cache is empty, no fetch → start fetch, register as pending, await result.
//
// This means the 1st user pays the latency, every subsequent user gets an instant
// response from cached content even while the pool is still being filled.
export async function cacheGetOrFetch(key, fetchFn, maxVariants = 3, ttlMs = 86_400_000) {
  const cached = cacheGet(key);

  if (cached && cached.length > 0) {
    // Serve from cache immediately
    const result = { data: randomPick(cached), hit: true };

    // If pool is not yet full and no background fetch is running, refill it silently
    if (cached.length < maxVariants && !pending.has(key)) {
      const bg = fetchFn()
        .then(data => { cacheAddVariant(key, data, maxVariants, ttlMs); pending.delete(key); return data; })
        .catch(() => { pending.delete(key); });
      pending.set(key, bg);
    }

    return result;
  }

  // Cache empty — join in-flight fetch or start a new one
  if (pending.has(key)) {
    const data = await pending.get(key);
    return { data, hit: false };
  }

  const promise = fetchFn()
    .then(data => {
      cacheAddVariant(key, data, maxVariants, ttlMs);
      pending.delete(key);
      return data;
    })
    .catch(err => {
      pending.delete(key);
      throw err;
    });

  pending.set(key, promise);
  const data = await promise;
  return { data, hit: false };
}
