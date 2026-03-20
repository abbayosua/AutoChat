import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/auth/use-auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AutoChat - AI-Powered Customer Support",
  description: "Transform your customer support with AI-powered responses, sentiment analysis, and intelligent routing. Automate responses and deliver exceptional customer experiences.",
  keywords: ["AI", "Customer Support", "Help Desk", "Sentiment Analysis", "Auto Response", "Live Chat", "Ticket Management"],
  authors: [{ name: "AutoChat Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "AutoChat - AI-Powered Customer Support",
    description: "Transform your customer support with AI-powered responses and sentiment analysis",
    url: "https://autochat.dev",
    siteName: "AutoChat",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoChat - AI-Powered Customer Support",
    description: "Transform your customer support with AI-powered responses and sentiment analysis",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
