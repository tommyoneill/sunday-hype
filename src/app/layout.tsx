import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Sunday Hype - Mass recap with some hype!",
  description: "Get this Sunday's readings & gospel explained in a way that makes sense to teenagers",
  authors: [{ name: "Sunday Hype Team" }],
  creator: "Sunday Hype Team",
  publisher: "Sunday Hype",
  keywords: ["bible", "gospel", "mass", "readings", "teenagers", "catholic", "christian", "youth"],
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", url: "/apple-touch-icon.png" },
  ],
  openGraph: {
    title: "Sunday Hype - Mass recap with some hype!",
    description: "Get this Sunday's readings & gospel explained in a way that makes sense to teenagers. We break down the weekly readings and gospel message into language that resonates with young people, making the Bible more accessible and relevant to their lives.",
    url: "https://www.sundayhype.com/",
    siteName: "Sunday Hype",
    images: [
      {
        url: "/images/social-preview.png",
        width: 1200,
        height: 630,
        alt: "Sunday Hype - Making the Bible accessible to teenagers",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sunday Hype - Mass recap with some hype!",
    description: "Get this Sunday's readings & gospel explained in a way that makes sense to teenagers. We break down the weekly readings and gospel message into language that resonates with young people.",
    images: ["/images/social-preview.png"],
    creator: "@sundayhype",
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
  verification: {
    google: "lfRhzjsQ_uhxmG95R85tpNDc1B2irkdr35CyksWMRzE",
  },
  // Additional meta tags for LinkedIn and other platforms
  other: {
    "article:author": "Sunday Hype Team",
    "article:published_time": "2024-04-22T00:00:00.000Z",
    "article:section": "Religion",
    "article:tag": ["bible", "gospel", "mass", "readings", "teenagers", "catholic", "christian", "youth"],
    "og:published_time": "2024-04-22T00:00:00.000Z",
  },
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
