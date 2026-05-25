import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="it">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="application-name" content="Lexyo" />
        <meta name="theme-color" content="#a855f7" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Lexyo" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="description" content="Lexyo è il professore AI per i bambini italiani dalla 3ª elementare alla 3ª media. Foto compiti, interrogazioni orali e quiz basati sul programma MIUR. Prova gratis 3 giorni." />
        <meta name="keywords" content="app educativa bambini, professore AI italiano, aiuto compiti, ripetizioni online, app scuola elementare, app scuola media, intelligenza artificiale bambini, studio AI" />
        <meta name="author" content="Lexyo.it" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Lexyo — Il professore AI di tuo figlio" />
        <meta property="og:description" content="Sempre paziente. Sempre disponibile. Non dà le risposte — insegna a trovarle. Prova gratis 3 giorni." />
        <meta property="og:image" content="https://app.lexyo.it/icons/icon-512.png" />
        <meta property="og:url" content="https://app.lexyo.it" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="it_IT" />
        <meta property="og:site_name" content="Lexyo" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Lexyo — Il professore AI di tuo figlio" />
        <meta name="twitter:description" content="Sempre paziente. Sempre disponibile. Non dà le risposte — insegna a trovarle." />
        <meta name="twitter:image" content="https://app.lexyo.it/icons/icon-512.png" />
        <link rel="canonical" href="https://app.lexyo.it" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icons/icon-512.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Lexyo",
              "description": "App educativa AI per bambini italiani dalla 3ª elementare alla 3ª media. Professore AI disponibile 24/7 per compiti, interrogazioni orali e quiz basati sul programma MIUR.",
              "url": "https://app.lexyo.it",
              "applicationCategory": "EducationalApplication",
              "operatingSystem": "Web, iOS, Android",
              "offers": {
                "@type": "Offer",
                "price": "12.90",
                "priceCurrency": "EUR",
                "priceValidUntil": "2027-12-31",
                "description": "Abbonamento mensile con 3 giorni di prova gratuita",
                "availability": "https://schema.org/InStock"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "24"
              },
              "author": {
                "@type": "Organization",
                "name": "Lexyo.it",
                "url": "https://app.lexyo.it"
              },
              "inLanguage": "it-IT",
              "audience": {
                "@type": "EducationalAudience",
                "educationalRole": "student",
                "audienceType": "Bambini 8-14 anni"
              }
            })
          }}
        />
        {/* Meta Pixel Facebook */}
        <script dangerouslySetInnerHTML={{__html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '810354571928741');
fbq('track', 'PageView');
`}} />
        {/* Privacy-friendly analytics by Plausible */}
        <script async src="https://plausible.io/js/pa-LK1UujSlmlt-uzKAP_sVV.js"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()`
          }}
        />
      </Head>
      <body className="antialiased" style={{ margin: 0 }}>
        <noscript><img height="1" width="1" style={{display:'none'}} src="https://www.facebook.com/tr?id=810354571928741&ev=PageView&noscript=1" /></noscript>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
