import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Sunday Hype - Bible Readings for Teens",
  description: "Get this Sunday's Bible readings explained in a way that makes sense to teenagers",
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", url: "/apple-touch-icon.png" },
  ],
  openGraph: {
    title: "Sunday Hype - Mass recap with some hype!",
    description: "Get this Sunday's readings & gospel explained in a way that makes sense to teenagers",
    url: "https://www.sundayhype.com/",
    siteName: "Sunday Hype",
    images: [
      {
        url: "/social-preview.png",
        width: 1200,
        height: 630,
        alt: "Sunday Hype - Bible Readings for Teens",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sunday Hype - Bible Readings for Teens",
    description: "Get this Sunday's Bible readings explained in a way that makes sense to teenagers",
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
