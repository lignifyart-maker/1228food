import type { Metadata } from "next";
import { Outfit, Playfair_Display, Geist_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lithos Inspiration | 礦石創作與迷因指引",
  description: "結合 50 多種神秘礦石能量與創作迷因，為您的創作之路提供不按牌理出牌的指引。",
  keywords: ["礦石", "占卜", "創作靈感", "Next.js", "迷因"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className="dark">
      <body
        className={`${outfit.variable} ${playfair.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <div className="noise-bg" />
        {children}
      </body>
    </html>
  );
}
