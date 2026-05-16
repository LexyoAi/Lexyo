import Head from "next/head";

export default function Cookie() {
  return (
    <>
      <Head>
        <title>Cookie Policy — Lexyo</title>
        <meta name="description" content="Informativa sull'uso dei cookie e del localStorage di Lexyo." />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>
      <style>{`
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html, body { overflow-y: auto !important; overflow-x: hidden; }
        body { background:#ffffff; color:#0D0F2B; font-family:'Plus Jakarta Sans',system-ui,sans-serif; }
        h2 { font-size:18px; font-weight:800; margin:32px 0 10px; color:#6366f1; }
        p { font-size:15px; line-height:1.78; color:#44476A; margin-bottom:12px; }
        ul { padding-left:22px; margin-bottom:12px; }
        li { font-size:15px; line-height:1.78; color:#44476A; margin-bottom:6px; }
        a { color:#6366f1; text-decoration:none; }
        a:hover { text-decoration:underline; }
        strong { color:#0D0F2B; font-weight:700; }
        table { width:100%; border-collapse:collapse; margin-bottom:16px; }
        th { text-align:left; font-size:12px; font-weight:800; color:#8892AE; text-transform:uppercase; letter-spacing:1px; padding:10px 14px; border-bottom:1px solid rgba(0,0,0,0.08); }
        td { font-size:13px; color:#44476A; padding:10px 14px; border-bottom:1px solid rgba(0,0,0,0.05); vertical-align:top; }
        tr:last-child td { border-bottom:none; }
      `}</style>
      <div style={{ maxWidth:"780px", margin:"0 auto", padding:"40px 24px 80px" }}>
        <a href="/" style={{ display:"inline-flex", alignItems:"center", gap:"8px", color:"#8892AE", fontSize:"14px", fontWeight:700 }}>← Torna a Lexyo</a>

        <div style={{ background:"rgba(99,102,241,0.06)", border:"1px solid rgba(99,102,241,0.15)", borderRadius:"24px", padding:"36px", marginTop:"28px", marginBottom:"36px" }}>
          <p style={{ fontSize:"12px", fontWeight:800, color:"#6366f1", textTransform:"uppercase", letterSpacing:"2px", marginBottom:"10px" }}>Documento legale</p>
          <h1 style={{ fontSize:"clamp(28px,5vw,42px)", fontWeight:900, letterSpacing:"-1px", marginBottom:"8px", color:"#0D0F2B" }}>Cookie Policy</h1>
          <p style={{ color:"#8892AE", fontSize:"13px", margin:0 }}>Ultimo aggiornamento: Maggio 2026 — versione 1.1</p>
        </div>

        <h2>1. Cosa sono i cookie</h2>
        <p>I cookie sono piccoli file di testo salvati dal browser quando visiti un sito web. Servono a memorizzare preferenze, gestire sessioni di accesso e raccogliere statistiche di utilizzo. La normativa europea (ePrivacy Directive e GDPR) richiede che tu sia informato sull'uso dei cookie e possa esprimere il tuo consenso.</p>

        <h2>2. Cosa usa Lexyo</h2>
        <p><strong>Lexyo utilizza esclusivamente tecnologie strettamente necessarie al funzionamento del servizio.</strong> Non utilizziamo cookie pubblicitari, cookie di profilazione, cookie di tracciamento di terze parti o pixel di retargeting.</p>

        <div style={{ background:"rgba(0,0,0,0.02)", border:"1px solid rgba(0,0,0,0.08)", borderRadius:"16px", overflow:"hidden", marginBottom:"16px" }}>
          <table>
            <thead>
              <tr>
                <th>Nome / Chiave</th>
                <th>Tipo</th>
                <th>Scopo</th>
                <th>Durata</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code style={{ background:"rgba(167,139,250,0.12)", borderRadius:"4px", padding:"1px 6px", fontSize:"12px" }}>supabase-auth-token</code></td>
                <td>Cookie di sessione</td>
                <td>Mantiene l'utente autenticato dopo il login</td>
                <td>Sessione / 7 giorni</td>
              </tr>
              <tr>
                <td><code style={{ background:"rgba(167,139,250,0.12)", borderRadius:"4px", padding:"1px 6px", fontSize:"12px" }}>lexyo_cookie_accepted</code></td>
                <td>localStorage</td>
                <td>Memorizza il consenso al banner cookie</td>
                <td>Permanente (fino a cancellazione manuale)</td>
              </tr>
              <tr>
                <td><code style={{ background:"rgba(167,139,250,0.12)", borderRadius:"4px", padding:"1px 6px", fontSize:"12px" }}>lexyo_tema</code></td>
                <td>localStorage</td>
                <td>Memorizza la preferenza tema chiaro/scuro</td>
                <td>Permanente</td>
              </tr>
              <tr>
                <td><code style={{ background:"rgba(167,139,250,0.12)", borderRadius:"4px", padding:"1px 6px", fontSize:"12px" }}>lexyo_streak_*</code></td>
                <td>localStorage</td>
                <td>Memorizza la striscia giornaliera di studio per figlio</td>
                <td>Permanente</td>
              </tr>
              <tr>
                <td><code style={{ background:"rgba(167,139,250,0.12)", borderRadius:"4px", padding:"1px 6px", fontSize:"12px" }}>lexyo_record_giochi</code></td>
                <td>localStorage</td>
                <td>Salva i record personali nei giochi</td>
                <td>Permanente</td>
              </tr>
              <tr>
                <td><code style={{ background:"rgba(167,139,250,0.12)", borderRadius:"4px", padding:"1px 6px", fontSize:"12px" }}>lexyo_referral_code</code></td>
                <td>localStorage</td>
                <td>Memorizza il codice referral se presente nell'URL</td>
                <td>Permanente</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>3. Cookie di terze parti</h2>
        <p>Lexyo <strong>non installa cookie di terze parti</strong> per scopi pubblicitari o di tracciamento. Le uniche comunicazioni con servizi esterni sono:</p>
        <ul>
          <li><strong>Supabase</strong>: per autenticazione e database (necessario al funzionamento del servizio)</li>
          <li><strong>Anthropic</strong>: per le risposte AI (richieste server-to-server, nessun cookie nel browser)</li>
          <li><strong>Stripe</strong>: per i pagamenti (solo nella pagina di checkout, cookie tecnici Stripe)</li>
        </ul>

        <h2>4. Google Fonts</h2>
        <p>Il sito usa Google Fonts per caricare il font "Plus Jakarta Sans". Google può raccogliere l'indirizzo IP durante il caricamento del font. Non sono impostati cookie di tracciamento da parte di Google. Per maggiori informazioni: <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">policies.google.com/privacy</a>.</p>

        <h2>5. Come gestire o eliminare i cookie</h2>
        <p>Puoi eliminare i cookie e i dati localStorage in qualsiasi momento dalle impostazioni del tuo browser:</p>
        <ul>
          <li><strong>Chrome</strong>: Impostazioni → Privacy e sicurezza → Cancella dati di navigazione</li>
          <li><strong>Safari</strong>: Preferenze → Privacy → Gestisci dati dei siti web</li>
          <li><strong>Firefox</strong>: Impostazioni → Privacy e sicurezza → Cookie e dati dei siti</li>
        </ul>
        <p>La cancellazione dei cookie di sessione comporta il logout dall'applicazione. La cancellazione del localStorage comporta la perdita delle preferenze locali (tema, streak, record giochi).</p>

        <h2>6. Consenso</h2>
        <p>Il banner cookie mostrato al primo accesso raccoglie il tuo consenso all'utilizzo delle tecnologie descritte in questa policy. Poiché utilizziamo solo tecnologie tecnicamente necessarie, il rifiuto non è possibile senza compromettere il funzionamento del servizio.</p>
        <p>Puoi revocare il consenso in qualsiasi momento cancellando il localStorage del browser come descritto al punto 5.</p>

        <h2>7. Modifiche alla Cookie Policy</h2>
        <p>In caso di modifiche sostanziali all'uso dei cookie, aggiorneremo questa pagina e informeremo gli utenti tramite banner o email.</p>

        <div style={{ marginTop:"40px", padding:"20px 24px", background:"rgba(0,0,0,0.02)", border:"1px solid rgba(0,0,0,0.08)", borderRadius:"16px", display:"flex", flexWrap:"wrap", gap:"16px", justifyContent:"space-between", alignItems:"center" }}>
          <p style={{ fontSize:"13px", color:"#8892AE", margin:0 }}>Domande: <a href="mailto:info@lexyo.it">info@lexyo.it</a></p>
          <div style={{ display:"flex", gap:"16px" }}>
            <a href="/privacy" style={{ fontSize:"13px", color:"#8892AE", fontWeight:600 }}>Privacy Policy</a>
            <a href="/termini" style={{ fontSize:"13px", color:"#8892AE", fontWeight:600 }}>Termini di Servizio</a>
          </div>
        </div>
      </div>
    </>
  );
}
