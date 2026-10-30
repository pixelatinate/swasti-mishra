import type { Metadata } from "next";
import { Work_Sans, Sour_Gummy } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import ClickTracker from "@/components/ClickTracker";
import "./globals.css";

const workSans = Work_Sans({
  weight: ["400", "500", "600"],
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
    <html lang="en" className={`${workSans.className} ${sourGummy.variable}`} suppressHydrationWarning>
      <head>
        {/* Set the theme attribute before first paint so there's no flash of
            the wrong theme. Defaults new visitors to dark; a saved choice
            in localStorage (from the toggle) wins after that. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark');}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`,
          }}
        />
      </head>
      <body>
        {/* Only the live site reports to Google Analytics, so local dev and
            Vercel preview deploys don't count as visitors. trackEvent()
            no-ops when window.gtag is missing. */}
        {process.env.VERCEL_ENV === "production" && (
          <>
            <Script async src="https://www.googletagmanager.com/gtag/js?id=G-0046WG76SX" />
            <Script id="ga-init">
              {`window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-0046WG76SX');`}
            </Script>
          </>
        )}
        {children}
        <Analytics />
        <ClickTracker />
      </body>
    </html>
  );
}
