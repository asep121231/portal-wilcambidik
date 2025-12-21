import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Portal Informasi Kedinasan | Wilcambidik Bruno",
    template: "%s | Wilcambidik Bruno",
  },
  description:
    "Portal resmi untuk menyampaikan update informasi kedinasan kepada satuan pendidikan Sekolah Dasar di Wilayah Cabang Dinas Pendidikan Bruno.",
  keywords: [
    "wilcambidik bruno",
    "portal informasi",
    "kedinasan",
    "sekolah dasar",
    "purworejo",
    "dinas pendidikan",
  ],
  authors: [{ name: "Wilcambidik Bruno" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Wilcambidik Bruno",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} antialiased`}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
