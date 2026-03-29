import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Docpilot — Votre help center se met à jour tout seul",
  description:
    "Docpilot analyse vos tickets support pour générer et maintenir automatiquement votre base de connaissances. Premier outil français, hébergé en Europe, RGPD natif.",
  openGraph: {
    title: "Docpilot — Votre help center se met à jour tout seul",
    description:
      "Transformez vos tickets support en articles de help center, automatiquement. Hébergé en Europe, RGPD natif.",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${jakarta.variable} ${jetbrains.variable} font-sans antialiased`}
      >
        <GoogleTagManager gtmId="GTM-PQ53F8RB" />
        <GoogleAnalytics gaId="G-V644R0HGX3" />
        {children}
      </body>
    </html>
  );
}
