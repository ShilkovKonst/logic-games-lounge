import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppProviders from "@/context/AppProviders";
import TopLevelMenu from "@/components/TopLevelMenu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Play, chill, enjoy",
  description: "Frendly-designed games for newbies and amateurs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`relative ${geistSans.variable} ${geistMono.variable} antialiased bg-hexagon`}
      >
        <AppProviders>
          <TopLevelMenu />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
