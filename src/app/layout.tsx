import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "Which 65 to 85 inch 4K TVs still boot straight to HDMI when you never give them a network",
  description:
    "For engineers who run Jellyfin off a NAS, feed the panel one Shield or Apple TV, and want to know before the box is upstairs whether the TV will nag, stall, or spy when it stays offline for life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
