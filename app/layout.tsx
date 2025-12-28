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
  metadataBase: new URL("https://1228food.vercel.app"),
  title: {
    default: "世界美食圖鑑 | World Food Encyclopedia",
    template: "%s | 世界美食圖鑑",
  },
  description:
    "探索世界各地的經典美食，透過精美的插畫與博物學風格的介紹，了解每道料理背後的歷史與文化故事。",
  keywords: [
    "美食",
    "世界料理",
    "食物介紹",
    "美食圖鑑",
    "壽司",
    "披薩",
    "塔可",
    "咖哩",
    "河粉",
    "food encyclopedia",
    "world cuisine",
  ],
  authors: [{ name: "Food Explorer" }],
  creator: "Food Explorer",
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: "https://1228food.vercel.app",
    siteName: "世界美食圖鑑",
    title: "世界美食圖鑑 | World Food Encyclopedia",
    description:
      "探索世界各地的經典美食，透過精美的插畫與博物學風格的介紹，了解每道料理背後的歷史與文化故事。",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fortune Draw | 隨機抽籤應用",
    description: "一個美觀的隨機抽籤應用框架，支援自訂項目、圖片和訊息。",
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
