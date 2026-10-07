import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const SITE_TITLE = "X. It’s what’s happening";
const SITE_DESCRIPTION =
  "From breaking news and entertainment to sports and politics, get the full story with all the live commentary.";

export const metadata: Metadata = {
  metadataBase: new URL("https://x-clone.elpepo.dev"),
  title: "X",
  description: SITE_DESCRIPTION,
  referrer: "no-referrer",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "X",
    locale: "en_US",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
