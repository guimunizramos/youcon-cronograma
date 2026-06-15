import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aniversário YouCon — Cronograma da Campanha",
  description: "Cronograma da campanha de aniversário YouCon 06 anos",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={geist.className}>
      <body className="bg-[#0d0d0d] antialiased">{children}</body>
    </html>
  );
}
