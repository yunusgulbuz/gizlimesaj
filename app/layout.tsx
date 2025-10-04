import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: "birmesajmutluluk - Sevdiklerinize Özel Sürpriz Mesajlar ve Hediyeler",
  description: "Sevdiklerinize özel, kişiselleştirilmiş dijital mesajlar ve hediye sayfaları oluşturun. Romantik, eğlenceli ve unutulmaz anlar için zamanlı mesaj deneyimi.",
  openGraph: {
    title: "birmesajmutluluk - Özel Dijital Hediyeler",
    description: "Sevdiklerinize özel, kişiselleştirilmiş dijital mesajlar ve hediye sayfaları oluşturun. Romantik, eğlenceli ve unutulmaz anlar için zamanlı mesaj deneyimi.",
    locale: "tr_TR",
    type: "website",
    siteName: "birmesajmutluluk - Özel Dijital Hediyeler",
  },
  twitter: {
    card: "summary_large_image",
    title: "birmesajmutluluk - Sevdiklerinize Özel Sürpriz Mesajlar ve Hediyeler",
    description: "Sevdiklerinize özel, kişiselleştirilmiş dijital mesajlar ve hediye sayfaları oluşturun.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
