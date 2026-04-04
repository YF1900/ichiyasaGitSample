import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";

export const metadata: Metadata = {
  title: "BaC OS - Business as Code",
  description: "ビジネスをコードとして扱う Business OS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <Sidebar />
        <main className="ml-60 p-8">{children}</main>
      </body>
    </html>
  );
}
