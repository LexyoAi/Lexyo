// Hybrid cache: L1 in-memory (0ms, volatile) + L2 Supabase (50ms, persistent).
// L1 serves hot content during active sessions.
// L2 survives cold starts — content is still available after serverless restarts.
import { createClient } from "@supabase/supabase-js";

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// ── L1: in-memory ────────────────────────────────────────────────────────────
const L1 = new Map();
const L1_MAX = 400;

function l1Set(key, value, expiresAt) {
  if (L1.size >= L1_MAX) L1.delete(L1.keys().next().value);
  L1.set(key, { value, expiresAt });
}

function l1Get(key) {
  const entry = L1.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) { L1.delete(key); return null; }
  return entry.value;
}

// ── L2: Supabase ─────────────────────────────────────────────────────────────
async function l2Get(key) {
  try {
    const { data } = await getSupabase()
      .from("ai_cache")
      .select("value")
      .eq("key", key)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();
    return data?.value ?? null;
  } catch { return null; }
}

async function l2Set(key, value, expiresAt) {
  try {
    await getSupabase()
      .from("ai_cache")
      .upsert({ key, value, expires_at: expiresAt }, { onConflict: "key" });
  } catch (e) {
    console.error("[cache] L2 write error:", e.message);
  }
}

// ── Coalescing ───────────────────────────────────────────────────────────────
const pending = new Map();

// ── Public API ───────────────────────────────────────────────────────────────
export function ck(...parts) {
  return parts
    .map(p => String(p ?? "").toLowerCase().trim().replace(/\s+/g, "_"))
    .join(":");
}

export function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Synchronous L1-only check (for legacy callers)
export function cacheGet(key) {
  return l1Get(key);
}

export function cacheHas(key) {
  return l1Get(key) !== null;
}

export async function cacheSet(key, value, ttlMs = 1_209_600_000) {
  const expiresAt = new Date(Date.now() + ttlMs).toISOString();
  l1Set(key, value, Date.now() + ttlMs);
  l2Set(key, value, expiresAt).catch(() => {});
}

export async function cacheAddVariant(key, newValue, maxVariants, ttlMs) {
  let existing = l1Get(key);
  if (!existing) existing = await l2Get(key) || [];
  const updated = existing.length >= maxVariants ? existing : [...existing, newValue];
  const expiresAt = new Date(Date.now() + ttlMs).toISOString();
  l1Set(key, updated, Date.now() + ttlMs);
  l2Set(key, updated, expiresAt).catch(() => {});
  return updated;
}

export async function cacheGetOrFetch(key, fetchFn, maxVariants = 3, ttlMs = 1_209_600_000) {
  // 1. L1 hit (0ms)
  const l1 = l1Get(key);
  if (l1 && l1.length > 0) {
    if (l1.length < maxVariants && !pending.has(key)) {
      const bg = fetchFn()
        .then(data => { cacheAddVariant(key, data, maxVariants, ttlMs); pending.delete(key); return data; })
        .catch(() => { pending.delete(key); });
      pending.set(key, bg);
    }
    return { data: randomPick(l1), hit: true };
  }

  // 2. L2 hit (~50ms, dopo cold start)
  if (!pending.has(key)) {
    const l2 = await l2Get(key);
    if (l2 && l2.length > 0) {
      l1Set(key, l2, Date.now() + ttlMs);
      if (l2.length < maxVariants) {
        const bg = fetchFn()
          .then(data => { cacheAddVariant(key, data, maxVariants, ttlMs); pending.delete(key); return data; })
          .catch(() => { pending.delete(key); });
        pending.set(key, bg);
      }
      return { data: randomPick(l2), hit: true };
    }
  }

  // 3. Cache miss — coalesce o nuova fetch
  if (pending.has(key)) {
    const data = await pending.get(key);
    return { data, hit: false };
  }

  const promise = fetchFn()
    .then(async data => {
      await cacheAddVariant(key, data, maxVariants, ttlMs);
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
