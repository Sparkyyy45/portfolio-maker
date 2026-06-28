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
  title: "DevPort — Developer Portfolio Builder",
  description: "Build a professional developer portfolio in minutes. Import from GitHub, LinkedIn, or your resume PDF. Deploy instantly with a unique URL.",
  keywords: ["developer portfolio", "portfolio builder", "github portfolio", "linkedin import", "resume parser"],
  authors: [{ name: "DevPort" }],
  openGraph: {
    title: "DevPort — Developer Portfolio Builder",
    description: "Build a professional developer portfolio in minutes. Import from GitHub, LinkedIn, or your resume PDF.",
    type: "website",
    siteName: "DevPort",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevPort — Developer Portfolio Builder",
    description: "Build a professional developer portfolio in minutes.",
  },
};

import { AuthProvider } from '@/contexts/AuthContext';

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
      <head>
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
