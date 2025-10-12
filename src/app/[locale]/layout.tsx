import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BN Tour",
    description: "Travel to Turkmenistan",
    icons: {
        icon: [
            { url: "/favicon.ico" },
            { url: "/icon.png", type: "image/svg+xml" },
        ],
    }
};

export default async function RootLayout({
  children,
                                       params,
}: Readonly<{
  children: React.ReactNode;
    params: Promise<{ locale: string }>;
}>) {
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }
  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <NextIntlClientProvider>
      <Header/>
        {children}
          <Footer/>
      </NextIntlClientProvider>
      </body>
    </html>
  );
}
