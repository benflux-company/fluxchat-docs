import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: {
    default: "FluxChat SDK — Assistant & in-app support for any product",
    template: "%s | FluxChat SDK",
  },
  description:
    "Official FluxChat SDK, CLI and embeddable widget. Add an AI assistant or full in-app support to any app — per-request context, persona, knowledge base.",
  keywords: ["fluxchat", "sdk", "cli", "chatbot", "ai", "support", "widget", "knowledge base"],
  authors: [{ name: "Benflux", url: "https://benflux-corp.com" }],
  creator: "Benflux",
  metadataBase: new URL("https://fluxchat-docs.vercel.app"),
  openGraph: {
    title: "FluxChat SDK",
    description: "Add an AI assistant or in-app support to any product.",
    url: "https://fluxchat-docs.vercel.app",
    siteName: "FluxChat SDK",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a12" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${mono.variable}`}>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
