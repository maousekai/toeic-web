import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/site/theme-provider";
import { SessionProvider } from "@/lib/auth/session-provider";
import { LanguageProvider } from "@/lib/use-language";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TOEIC Ace AI — Smart English Test Prep with AI",
  description: "Master the TOEIC Listening & Reading test with AI-powered tutoring, full practice tests, instant grading, grammar lessons, vocabulary flashcards and personalized study plans.",
  keywords: ["TOEIC", "English", "AI tutor", "practice test", "grammar", "vocabulary", "ESL"],
  authors: [{ name: "TOEIC Ace AI" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "TOEIC Ace AI — Smart English Test Prep",
    description: "AI-powered TOEIC preparation with practice tests, grading, and personalized tutoring.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" translate="no" suppressHydrationWarning>
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <SessionProvider>
            <LanguageProvider>
              {children}
            </LanguageProvider>
          </SessionProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
