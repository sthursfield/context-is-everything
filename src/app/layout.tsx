import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import Script from 'next/script'
import LayoutProvider from '@/components/LayoutProvider'
import "./globals.css";

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: "Context is Everything - AI Strategy & Implementation",
  description: "AI consultancy focused on context-first implementation. We analyse how things actually work before suggesting solutions. Led by enterprise software and operations specialists.",
  keywords: [
    "AI consultancy",
    "AI strategy consulting",
    "context-first AI",
    "AI implementation",
    "business transformation",
    "enterprise AI",
    "operational AI",
    "AI analysis",
    "strategic AI planning"
  ],
  authors: [{ name: "Context is Everything Team" }],
  creator: "Context is Everything",
  publisher: "Context is Everything",
  metadataBase: new URL('https://www.context-is-everything.com'),
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },

  // OpenGraph for social sharing
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://www.context-is-everything.com',
    title: 'Context is Everything - AI Strategy & Implementation',
    description: 'AI consultancy focused on context-first implementation. We analyse how things work before suggesting solutions.',
    siteName: 'Context is Everything',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Context is Everything - Strategic AI consultancy',
      }
    ],
  },

  // Twitter Cards
  twitter: {
    card: 'summary_large_image',
    title: 'Context is Everything - AI Strategy & Implementation',
    description: 'Context-first AI consultancy. We analyse how things work before suggesting solutions.',
    images: ['/og-image.png'],
  },

  // Additional metadata
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  category: 'Technology',
  classification: 'Business Services',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Context is Everything",
    "description": "AI consultancy focused on context-first implementation. We analyse how things actually work before suggesting solutions.",
    "url": "https://www.context-is-everything.com",
    "logo": "https://www.context-is-everything.com/assets/CIE_stacked_cropped.png",
    "foundingDate": "2024",
    "industry": "Artificial Intelligence Consulting",
    "areaServed": {
      "@type": "Country",
      "name": "United Kingdom"
    },
    "serviceType": "AI Consulting",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "GB"
    },
    "service": [
      {
        "@type": "Service",
        "name": "Context-First AI Strategy",
        "description": "We analyse your actual operational context before recommending AI solutions",
        "serviceType": "AI Strategy Consulting"
      },
      {
        "@type": "Service",
        "name": "AI Implementation Analysis",
        "description": "Cross-sector pattern recognition to identify what works in your specific context",
        "serviceType": "AI Implementation Consulting"
      },
      {
        "@type": "Service",
        "name": "Operational Transformation",
        "description": "Business transformation guided by understanding how things actually work",
        "serviceType": "Business Transformation Consulting"
      }
    ],
    "team": [
      {
        "@type": "Person",
        "name": "Lindsay Smith",
        "jobTitle": "Chief Technology Officer",
        "description": "Enterprise software veteran with 20+ years FinTech experience. Former CTO at Telrock (17 years), technical innovation specialist."
      },
      {
        "@type": "Person",
        "name": "Robbie MacIntosh",
        "jobTitle": "Operations Director",
        "description": "Crisis management and operational transformation specialist. Co-founder of Is Everyone Safe."
      },
      {
        "@type": "Person",
        "name": "Spencer Thursfield",
        "jobTitle": "Strategy Director",
        "description": "AI strategy and brand positioning specialist with cross-sector pattern recognition expertise."
      }
    ]
  };

  return (
    <html lang="en" className={`${inter.variable}`}>
      <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#0EA5E9" />
        <meta name="color-scheme" content="light" />
        
        {/* Performance hints */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        
        {/* Security */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      </head>
      <body className={`${inter.className} font-sans antialiased`}>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-LXTHRW7Q7Q"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LXTHRW7Q7Q');
          `}
        </Script>

        {/* Skip to main content for accessibility */}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50">
          Skip to main content
        </a>

        {/* Hidden content for SEO crawlers */}
        <div className="sr-only">
          <h1>Context is Everything - AI Strategy & Implementation Consultancy</h1>
          <p>
            AI consultancy focused on context-first implementation. We analyse how things actually work
            before suggesting solutions. Our team combines enterprise software expertise, operational
            transformation experience, and strategic AI analysis.
          </p>
          <nav aria-label="Main services">
            <ul>
              <li>Context-First AI Strategy - analysing operational reality before recommending solutions</li>
              <li>AI Implementation Analysis - cross-sector pattern recognition for your context</li>
              <li>Operational Transformation - guided by understanding how things work</li>
              <li>Strategic AI Planning - honest evaluation of whether AI makes sense</li>
            </ul>
          </nav>
          <section aria-label="Team expertise">
            <h2>Our Team</h2>
            <ul>
              <li>Lindsay Smith, CTO - Enterprise software veteran, 20+ years FinTech, former CTO at Telrock</li>
              <li>Robbie MacIntosh, Operations Director - Crisis management and operational transformation specialist</li>
              <li>Spencer Thursfield, Strategy Director - AI strategy and cross-sector pattern recognition</li>
            </ul>
          </section>
          <p>
            Visit our conversational AI interface to discuss your specific situation and explore whether
            AI implementation makes sense for your context.
          </p>
        </div>

        
        <LayoutProvider>
          {children}
        </LayoutProvider>
      </body>
    </html>
  );
}
