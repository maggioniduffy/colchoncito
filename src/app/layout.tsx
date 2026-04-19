import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Colchoncito",
  description: "Tus finanzas en pesos y dólares, sin planillas.",
  openGraph: {
    title: "Colchoncito",
    description: "La app de presupuesto pensada para la realidad argentina.",
    url: "https://colchoncito.vercel.app",
    siteName: "Colchoncito",
    images: [
      {
        url: "https://colchoncito.vercel.app/og.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Colchoncito",
    description: "Tus finanzas en pesos y dólares, sin planillas.",
    images: ["https://colchoncito.vercel.app/og.png"],
  },
  icons: {
    icon: "/favicon-32.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${inter.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="h-full font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
