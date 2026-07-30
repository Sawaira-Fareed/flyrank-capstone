import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BloomLab",
  description: "Learning grows naturally.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}