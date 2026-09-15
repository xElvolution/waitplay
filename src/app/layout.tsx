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
  title: "Waitplay | Make Waiting for AI Fun",
  description:
    "Wait-layer SDK and app for AI agents. Micro-games, tool votes, partial artifact previews, and XP streaks while models think.",
  authors: [{ name: "XElvolution" }],
  openGraph: {
    title: "Waitplay | Make Waiting for AI Fun",
    description:
      "Turn agent latency into play with Waitplay. Reusable wait overlay and streaming worker.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="wp-canvas min-h-full flex flex-col bg-[#050506] text-zinc-100">
        {children}
      </body>
    </html>
  );
}
