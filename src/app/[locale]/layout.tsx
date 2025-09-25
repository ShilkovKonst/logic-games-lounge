import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../global.css";
import AppProviders from "@/context/AppProviders";
import TopLevelMenu from "@/components/TopLevelMenu";
import { Locale, t } from "@/lib/locales/locale";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: t(locale, "meta.titleFull"),
    description: t(locale, "meta.description"),
  };
}

export default async function RootLayout({
  params,
  children,
}: Readonly<{
  params: { locale: Locale };
  children: React.ReactNode;
}>) {
  const { locale } = await params;
  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-hexagon`}
      >
        <AppProviders>
          <header className="relative">
            <TopLevelMenu />
          </header>
          {children}
          <footer></footer>
        </AppProviders>
      </body>
    </html>
  );
}
