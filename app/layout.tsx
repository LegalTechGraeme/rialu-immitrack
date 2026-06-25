import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rialu ImmiTrack",
  description: "Immigration case tracking demo for Rialu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
