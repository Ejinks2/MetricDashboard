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
  title: "Jinks Dashboard",
  description: "Dashboard Display for Variable Components, such as weather, fitness, and more.",
  keywords: ["next.js", "react", "javascript", "tailwindcss"],
  generator: "Next.js",
  applicationName: "Next.js",
  authors: [{ name: "Ethan Jinks", url: "https://example.com" }],
  creator: "Ethan Jinks",
  publisher: "Ethan Jinks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
