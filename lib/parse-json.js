export function parseJSON(testo, tipo = "object") {
  if (!testo) throw new Error("Risposta AI vuota");
  const s = testo.trim();
  try { return JSON.parse(s); } catch {}
  const pattern = tipo === "array" ? /\[[\s\S]*\]/ : /\{[\s\S]*\}/;
  const match = s.match(pattern);
  if (match) {
    try { return JSON.parse(match[0]); } catch {}
    try {
      const clean = match[0].replace(/,(\s*[}\]])/g, "$1");
      return JSON.parse(clean);
    } catch {}
  }
  console.error("[parseJSON] fallimento parsing:", s.slice(0, 400));
  throw new Error("JSON non valido nella risposta AI");
}
