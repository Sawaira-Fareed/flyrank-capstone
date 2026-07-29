import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlyRank Capstone",
  description: "Frontend AI Engineering Capstone",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
        <nav className="border-b p-4 flex gap-6 text-sm">
          <Link href="/">Home</Link>
          <Link href="/chat">Chat</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/settings">Settings</Link>
          <Link href="/health">Health</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}