import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "L'Almanach de Maraf",
  description: "Bienvenue dans L'Almanach de Maraf, votre guide ultime pour optimiser vos aventures dans l'univers de Dofus. Que vous soyez artisan chevronné, chasseur de trésors ou stratège des arènes, ce site est votre allié incontournable pour calculer, planifier et maximiser vos gains. Grâce à des outils intuitifs, des bases de données détaillées et des conseils avisés, dominez l'économie et les défis d'Amakna avec sagesse et efficacité. Ouvrez le grimoire, et que la magie des Kamas opère !",
  icons: {
    icon: '/favicon.ico', // Chemin vers le favicon
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
