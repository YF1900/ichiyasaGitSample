import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";

export const metadata: Metadata = {
  title: "BaC OS - Business as Code",
  description: "ビジネスをコードとして扱う Business OS - 制約・仮説・実験・学習のサイクルを高速化する",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full" style={{ colorScheme: "light" }}>
      <body
        className="min-h-full flex flex-col"
        style={{ background: "#f8f9fa", color: "#1a1a2e" }}
      >
        {/* Skip Navigation for keyboard users */}
        <a href="#main-content" className="skip-link">
          メインコンテンツへスキップ
        </a>
        <div className="flex min-h-screen">
          <Sidebar />
          <main
            id="main-content"
            className="flex-1 ml-64 p-8 min-h-screen"
            style={{ background: "#f8f9fa" }}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
