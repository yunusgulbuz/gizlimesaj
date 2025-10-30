import type { Metadata } from "next";
import Script from "next/script";
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
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-10976985478"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-10976985478');
            `,
          }}
        />

        {/* Meta Pixel Code */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '857299663622173');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=857299663622173&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
