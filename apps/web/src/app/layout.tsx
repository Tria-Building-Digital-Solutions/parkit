import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Work_Sans } from "next/font/google";

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Parkit | Valet Parking Management Platform",
  description: "B2B2B platform for valet parking management — digital tickets, QR codes, real-time dashboard, mobile apps for operators and customers. Manage parking operations for malls, hospitals, hotels, and more.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body className={`bg-page text-text-primary antialiased ${workSans.variable}`} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
