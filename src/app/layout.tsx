import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Granada Sabores | Guia gastronomica de Granada, Nicaragua",
    template: "%s | Granada Sabores",
  },
  description:
    "Descubre restaurantes, cafes, bares y lugares turisticos en Granada, Nicaragua.",
  metadataBase: new URL("https://granada-sabores.vercel.app"),
  openGraph: {
    title: "Granada Sabores",
    description:
      "Guia moderna de restaurantes y experiencias gastronomicas en Granada, Nicaragua.",
    type: "website",
    locale: "es_NI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
