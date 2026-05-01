import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eppy — Epson Helpdesk",
  description: "Smart AI Helpdesk untuk PT Epson Indonesia Industry",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-screen" style={{ backgroundColor: 'var(--epson-bg)' }}>
        {children}
      </body>
    </html>
  );
}