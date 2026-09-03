import type { Metadata } from "next";
import {
  Barlow_Condensed,
  IBM_Plex_Mono,
  Titillium_Web,
} from "next/font/google";

import { RouteTransition } from "@/components/shared/route-transition";

import "./globals.css";
import "./motion.css";

const displayFont = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display-source",
  display: "swap",
});

const bodyFont = Titillium_Web({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-body-source",
  display: "swap",
});

const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-source",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SEPANG 56",
  description:
    "Learn F1, understand Sepang, make your picks, and compete with friends.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`}
    >
      <body className="min-h-screen bg-canvas font-sans text-foreground antialiased">
        <RouteTransition>{children}</RouteTransition>
      </body>
    </html>
  );
}
