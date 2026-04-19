import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "@/components/providers/session-provider";
import { LanguageProvider } from "@/components/providers/language-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CSR Hub - Platform Marketplace CSR Nasional",
    template: "%s | CSR Hub",
  },
  description:
    "Platform marketplace CSR nasional yang menghubungkan perusahaan dengan NGO, komunitas, yayasan, dan startup sosial untuk program CSR yang berdampak.",
  keywords: [
    "CSR", "Corporate Social Responsibility", "NGO", "program sosial",
    "marketplace CSR", "pendanaan sosial", "SDGs", "dampak sosial",
  ],
  authors: [{ name: "CSR Hub Team" }],
  creator: "CSR Hub",
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "CSR Hub",
    title: "CSR Hub - Platform Marketplace CSR Nasional",
    description: "Wujudkan dampak sosial nyata bersama.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CSR Hub - Platform Marketplace CSR Nasional",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f8f4",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${inter.variable} ${plusJakarta.variable}`}
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <SessionProvider>
          <QueryProvider>
            <LanguageProvider>
              <ThemeProvider>
                {children}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: "hsl(var(--card))",
                      color: "hsl(var(--foreground))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.75rem",
                      boxShadow: "0 10px 40px -10px rgba(0,0,0,0.15)",
                    },
                  }}
                />
              </ThemeProvider>
            </LanguageProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
