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
  title: "ぬい活スポット検索",
  description: "推しぬいと一緒に過ごせるおすすめカフェ・撮影スポット",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      {/* 
        bg-pink-50/40: 全体のほんのりパステル背景
        radial-dot-pattern: ドット柄背景（CSSパターン）
      */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-amber-50/10 text-slate-800 antialiased`}
        style={{
          backgroundImage: `
      radial-gradient(#fbcfe8 1.5px, transparent 1.5px),
      radial-gradient(#bae6fd 1.5px, transparent 1.5px),
      radial-gradient(#fef08a 1.5px, transparent 1.5px),
      radial-gradient(#bbf7d0 1.5px, transparent 1.5px)
    `,
          backgroundPosition: "0 0, 16px 16px, 16px 0, 0 16px",
          backgroundSize: "32px 32px",
        }}
      >
        {children}
      </body>
    </html>
  );
}
