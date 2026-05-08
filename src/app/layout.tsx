import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from '@react-oauth/google';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "EcoSpark Hub — Community-Powered Sustainability",
    template: "%s | EcoSpark Hub",
  },
  description:
    "Share, discover, and vote on sustainable ideas that make a real difference. Join a community of eco-innovators building a greener future.",
  keywords: ["sustainability", "eco", "green", "community", "ideas", "environment"],
  openGraph: {
    title: "EcoSpark Hub",
    description: "Community-Powered Sustainability Platform",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${plusJakarta.variable} font-body antialiased`}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          <ThemeProvider>
            <QueryProvider>
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "var(--color-primary-600)",
                    color: "#fff",
                    borderRadius: "12px",
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    fontWeight: "500",
                  },
                  success: { iconTheme: { primary: "#fff", secondary: "#16a34a" } },
                  error: {
                    style: { background: "#ef4444" },
                    iconTheme: { primary: "#fff", secondary: "#ef4444" },
                  },
                }}
              />
            </QueryProvider>
          </ThemeProvider>
        </GoogleOAuthProvider>

      </body>
    </html>
  );
}
