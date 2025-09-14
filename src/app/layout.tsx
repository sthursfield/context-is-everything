import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import LayoutProvider from '@/components/LayoutProvider'
import "./globals.css";

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: "Context is Everything - AI Consultancy | Strategic AI Implementation",
  description: "Expert AI consultancy specializing in contextual solutions. We build intelligent systems that adapt, understand context, and scale with your business. Strategic AI implementation for modern enterprises.",
  keywords: [
    "AI consultancy",
    "artificial intelligence consulting", 
    "contextual AI",
    "AI strategy",
    "machine learning consulting",
    "AI implementation",
    "business AI solutions",
    "AI transformation",
    "intelligent systems",
    "AI architecture"
  ],
  authors: [{ name: "Context is Everything Team" }],
  creator: "Context is Everything",
  publisher: "Context is Everything",
  metadataBase: new URL('https://contextiseverything.ai'),
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  
  // OpenGraph for social sharing
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://contextiseverything.ai',
    title: 'Context is Everything - AI Consultancy',
    description: 'Expert AI consultancy specializing in contextual solutions that adapt and scale with your business.',
    siteName: 'Context is Everything',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Context is Everything - 3D geometric logo with contextual branding',
      }
    ],
  },

  // Twitter Cards
  twitter: {
    card: 'summary_large_image',
    site: '@contextiseverything',
    creator: '@contextiseverything',
    title: 'Context is Everything - AI Consultancy',
    description: 'Expert AI consultancy specializing in contextual solutions that adapt and scale.',
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
  
  verification: {
    google: 'your-google-verification-code',
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
    "description": "AI consultancy specializing in contextual solutions that adapt and understand business context.",
    "url": "https://contextiseverything.ai",
    "logo": "https://contextiseverything.ai/logo.png",
    "foundingDate": "2024",
    "industry": "Artificial Intelligence Consulting",
    "numberOfEmployees": "10-50",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-CONTEXT",
      "contactType": "customer service",
      "availableLanguage": ["English"]
    },
    "sameAs": [
      "https://linkedin.com/company/contextiseverything",
      "https://twitter.com/contextiseverything"
    ],
    "service": [
      {
        "@type": "Service",
        "name": "AI Strategy Consulting",
        "description": "Strategic planning and roadmap development for AI implementation"
      },
      {
        "@type": "Service", 
        "name": "Contextual AI Development",
        "description": "Custom AI solutions that understand and adapt to business context"
      },
      {
        "@type": "Service",
        "name": "AI System Architecture",
        "description": "Scalable architecture design for intelligent business systems"
      }
    ],
    "team": [
      {
        "@type": "Person",
        "name": "Sarah Chen",
        "jobTitle": "Chief Technology Officer",
        "description": "Leading technology strategy with 15+ years in scalable architecture and AI integration."
      },
      {
        "@type": "Person", 
        "name": "Marcus Rodriguez",
        "jobTitle": "Chief Operating Officer",
        "description": "Operations excellence focused on sustainable growth and team development."
      },
      {
        "@type": "Person",
        "name": "Elena Kowalski", 
        "jobTitle": "Chief Marketing Officer",
        "description": "Brand strategist with expertise in contextual marketing and digital transformation."
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
        {/* Skip to main content for accessibility */}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50">
          Skip to main content
        </a>

        {/* Hidden content for SEO crawlers */}
        <div className="sr-only">
          <h1>Context is Everything - Premier AI Consultancy</h1>
          <p>
            We are a leading artificial intelligence consultancy specializing in contextual AI solutions. 
            Our expert team helps businesses implement intelligent systems that understand context, 
            adapt to changing environments, and scale efficiently.
          </p>
          <nav aria-label="Main services">
            <ul>
              <li>AI Strategy Consulting and Planning</li>
              <li>Contextual AI System Development</li>
              <li>Machine Learning Implementation</li>
              <li>AI Architecture and Scaling</li>
              <li>Business Intelligence Solutions</li>
            </ul>
          </nav>
          <address>
            Contact us for AI consultation and strategic planning services.
            Email: hello@contextiseverything.ai
            Phone: +1-555-CONTEXT
          </address>
        </div>

        
        <LayoutProvider>
          {children}
        </LayoutProvider>
      </body>
    </html>
  );
}
