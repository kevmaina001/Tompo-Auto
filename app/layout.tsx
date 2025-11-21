import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/lib/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.tomposauto.com"),
  title: {
    default: "Tompo's Auto Spare Parts | Quality Auto Parts in Kenya",
    template: "%s | Tompo's Auto Spare Parts",
  },
  description: "Kenya's trusted supplier of genuine auto spare parts. Quality engine parts, brake systems, suspension, electrical components for all vehicle makes. Fast delivery in Nairobi & nationwide. Get instant quotes via WhatsApp.",
  keywords: [
    "auto spare parts Kenya",
    "car parts Nairobi",
    "genuine auto parts",
    "vehicle spare parts",
    "engine parts Kenya",
    "brake parts Nairobi",
    "suspension parts",
    "Toyota parts Kenya",
    "Nissan parts Kenya",
    "car accessories Nairobi",
    "OEM auto parts",
    "affordable car parts",
    "auto parts shop near me",
    "Tompo's Auto",
  ],
  authors: [{ name: "Tompo's Auto Spare Parts" }],
  creator: "Tompo's Auto Spare Parts",
  publisher: "Tompo's Auto Spare Parts",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "/",
    siteName: "Tompo's Auto Spare Parts",
    title: "Tompo's Auto Spare Parts | Quality Auto Parts in Kenya",
    description: "Kenya's trusted supplier of genuine auto spare parts. Quality parts for all vehicle makes. Fast delivery & instant WhatsApp quotes.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tompo's Auto Spare Parts - Quality Auto Parts in Kenya",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tompo's Auto Spare Parts | Quality Auto Parts in Kenya",
    description: "Kenya's trusted supplier of genuine auto spare parts. Quality parts for all vehicle makes. Fast delivery & instant WhatsApp quotes.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "/",
  },
  category: "automotive",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* JSON-LD Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AutoPartsStore",
              name: "Tompo's Auto Spare Parts",
              description: "Kenya's trusted supplier of genuine auto spare parts for all vehicle makes and models.",
              url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.tomposauto.com",
              logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.tomposauto.com"}/logo.png`,
              image: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.tomposauto.com"}/og-image.jpg`,
              telephone: "+254708328905",
              email: "info@tomposauto.com",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Nairobi",
                addressCountry: "KE",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "-1.2921",
                longitude: "36.8219",
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  opens: "08:00",
                  closes: "18:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: "Saturday",
                  opens: "09:00",
                  closes: "16:00",
                },
              ],
              priceRange: "$$",
              paymentAccepted: ["Cash", "M-Pesa", "Bank Transfer"],
              areaServed: {
                "@type": "Country",
                name: "Kenya",
              },
              sameAs: [
                "https://wa.me/254708328905",
              ],
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <Script
          src="https://upload-widget.cloudinary.com/global/all.js"
          strategy="beforeInteractive"
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
