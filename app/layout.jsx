import { Barlow_Condensed, Public_Sans } from "next/font/google";
import "../src/styles.css";

const siteUrl = "https://nathanhergesel.me";
const title = "Nathan Hergesel | Desenvolvedor Web, Designer e Editor";
const description =
  "Nathan Hergesel cria sites, aplicativos, interfaces, identidades visuais e vídeos sob medida em Itapetininga, do briefing ao suporte pós-entrega.";

const displayFont = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-barlow-condensed",
  display: "swap"
});

const bodyFont = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-public-sans",
  display: "swap"
});

export const metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: "Hergesel.dev",
  authors: [{ name: "Nathan Hergesel", url: siteUrl }],
  creator: "Nathan Hergesel",
  publisher: "Nathan Hergesel",
  alternates: {
    canonical: "/",
    languages: {
      "pt-BR": "/",
      "x-default": "/"
    }
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "Nathan Hergesel",
    title,
    description: "Sites, aplicativos, design e conteúdo digital sob medida, do briefing ao suporte pós-entrega.",
    images: [
      {
        url: "/assets/images/social-preview.jpg",
        width: 1200,
        height: 630,
        alt: "Portfólio de Nathan Hergesel, desenvolvedor web, designer e editor"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: "Sites, aplicativos, design e conteúdo digital sob medida.",
    images: ["/assets/images/social-preview.jpg"]
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/assets/brand/favicon-512.png", type: "image/png", sizes: "512x512" }
    ],
    apple: [{ url: "/assets/brand/apple-touch-icon.png", sizes: "180x180" }]
  },
  manifest: "/site.webmanifest"
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f4f1e9"
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: "Nathan Hergesel",
      alternateName: "Hergesel.dev",
      inLanguage: "pt-BR",
      publisher: { "@id": `${siteUrl}/#person` }
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Nathan Hergesel",
      url: `${siteUrl}/`,
      image: `${siteUrl}/assets/images/nathan-hergesel.webp`,
      jobTitle: "Desenvolvedor Web, Designer e Editor",
      description:
        "Desenvolvedor web, designer e editor que cria soluções digitais sob medida do briefing ao suporte pós-entrega.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Itapetininga",
        addressRegion: "SP",
        addressCountry: "BR"
      },
      sameAs: [
        "https://www.linkedin.com/in/nathan-hergesel/",
        "https://github.com/Nathan-Hergesel",
        "https://www.instagram.com/hergesel.dev/",
        "https://x.com/Herisguel"
      ],
      knowsAbout: [
        "Desenvolvimento web",
        "Aplicativos web e mobile",
        "UI/UX",
        "Design gráfico",
        "Edição de vídeo",
        "JavaScript",
        "TypeScript",
        "React",
        "Python"
      ]
    }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${displayFont.variable} ${bodyFont.variable} js`}>
      <head>
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important;clip-path:none!important}`}</style>
        </noscript>
        <link
          rel="preload"
          as="image"
          href="/assets/images/nathan-hergesel.webp"
          type="image/webp"
          fetchPriority="high"
        />
      </head>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c")
          }}
        />
      </body>
    </html>
  );
}
