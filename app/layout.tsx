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
  metadataBase: new URL("https://lithos-inspiration.vercel.app"), // Replace with your actual deployment URL
  title: {
    default: "Lithos Inspiration | 礦石創作與迷因指引",
    template: "%s | Lithos Inspiration",
  },
  description: "結合 50 多種神秘礦石能量與創作迷因，為您的創作之路提供不按牌理出牌的指引。從紅寶黝簾石到黑星石，讓每一顆礦石為你的寫作靈感引路。",
  keywords: ["礦石", "占卜", "創作靈感", "寫作", "靈感", "迷因", "水晶", "能量", "Lithos"],
  authors: [{ name: "Lithos Team" }],
  creator: "Lithos Team",
  openGraph: {
    title: "Lithos Inspiration | 礦石創作與迷因指引",
    description: "結合 50 多種神秘礦石能量與創作迷因，為您的創作之路提供不按牌理出牌的指引。",
    url: "https://lithos-inspiration.vercel.app",
    siteName: "Lithos Inspiration",
    locale: "zh_TW",
    type: "website",
    images: [
      {
        url: "/og-image.jpg", // You should create this image in public/
        width: 1200,
        height: 630,
        alt: "Lithos Inspiration Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lithos Inspiration | 礦石創作與迷因指引",
    description: "結合 50 多種神秘礦石能量與創作迷因，為您的創作之路提供不按牌理出牌的指引。",
    images: ["/og-image.jpg"], // Same as OG image
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
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className="dark" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${playfair.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <div className="noise-bg" />
        {children}
      </body>
    </html>
  );
}
