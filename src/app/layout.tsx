import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import { Toaster } from "sonner";

import { AppProviders } from "@/components/providers/app-providers";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MovieNext | Premium Streaming Platform",
    template: "%s | MovieNext",
  },
  description: "Experience cinema like never before. Watch movies, TV series, and theatrical plays in stunning 3D quality with personalized recommendations.",
  keywords: ["movies", "streaming", "tv series", "theatrical plays", "3D", "cinema", "entertainment"],
  authors: [{ name: "MovieNext Team" }],
  creator: "MovieNext",
  publisher: "MovieNext",
  metadataBase: new URL("https://movienext.example.com"),
  openGraph: {
    title: "MovieNext - Premium Streaming Platform",
    description: "Watch the latest movies and series in stunning quality",
    type: "website",
    locale: "en_US",
    siteName: "MovieNext",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MovieNext Streaming Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MovieNext - Premium Streaming",
    description: "Watch the latest movies and series",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  category: "entertainment",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${bebasNeue.variable} min-h-screen bg-background font-sans text-foreground antialiased`}
      >
        <AppProviders>
          <AnimatedBackground particleCount={18}>
            {children}
          </AnimatedBackground>
          <Toaster 
            position="top-right"
            richColors
            closeButton
            theme="dark"
            toastOptions={{
              style: {
                background: "rgba(0, 0, 0, 0.9)",
                border: "1px solid rgba(229, 9, 20, 0.3)",
                borderRadius: "16px",
                color: "white",
              },
              duration: 4000,
            }}
          />
        </AppProviders>
      </body>
    </html>
  );
}
