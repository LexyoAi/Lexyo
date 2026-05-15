import "@/styles/globals.css";
import React, { useEffect } from "react";

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { console.error("App error:", error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"100vh", fontFamily:"sans-serif", padding:"20px", textAlign:"center" }}>
          <div style={{ fontSize:"48px", marginBottom:"16px" }}>😅</div>
          <h2 style={{ fontSize:"18px", marginBottom:"8px" }}>Qualcosa è andato storto</h2>
          <p style={{ fontSize:"14px", color:"#666", marginBottom:"20px" }}>Ricarica la pagina per continuare</p>
          <button onClick={() => window.location.reload()} style={{ padding:"10px 24px", background:"#6C47FF", color:"white", border:"none", borderRadius:"12px", fontSize:"14px", fontWeight:"700", cursor:"pointer" }}>
            Ricarica
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App({ Component, pageProps }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    const handler = (e) => {
      e.preventDefault();
      window.__pwaInstallPrompt = e;
      window.dispatchEvent(new Event("pwaPromptReady"));
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  return <ErrorBoundary><Component {...pageProps} /></ErrorBoundary>;
}
