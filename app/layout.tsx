import type { Metadata } from "next";
import { Roboto, Sour_Gummy } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const sourGummy = Sour_Gummy({
  weight: "variable",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sour-gummy",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.swasti-mishra.com"),
  title: "Swasti Mishra",
  description: "Check out what I'm working on!⋆˙⟡",
  openGraph: {
    title: "Swasti Mishra",
    type: "website",
    url: "https://www.swasti-mishra.com",
    images: ["https://swasti-mishra.com/images/card.png"],
    description: "Check out what I'm working on!⋆˙⟡",
  },
  icons: {
    icon: [
      { url: "/favicon/favicon-96x96.png", type: "image/png", sizes: "96x96" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon/favicon.ico",
    apple: "/favicon/apple-touch-icon.png",
  },
  appleWebApp: {
    title: "Swasti",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${roboto.className} ${sourGummy.variable}`}>
      <body>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-0046WG76SX" />
        <Script id="ga-init">
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0046WG76SX');`}
        </Script>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
