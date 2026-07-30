import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "BloomLab",
  description: "Learning grows naturally.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-20 lg:w-64 flex flex-col justify-between p-4 lg:p-6 glass-card m-3 rounded-card">
          <div>
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 lg:gap-3 mb-10">
              <span className="text-3xl">🌸</span>
              <span className="hidden lg:block font-heading text-xl font-bold text-bloom-navy">
                BloomLab
              </span>
            </Link>

            {/* Nav Links */}
            <nav className="flex flex-col gap-1">
              {[
                { href: "/", label: "Home", icon: "🏠" },
{ href: "/path", label: "Skill Map", icon: "🗺️" },
{ href: "/learn", label: "Learn", icon: "📖" },
{ href: "/dashboard", label: "Dashboard", icon: "📊" },
{ href: "/archive", label: "Archive", icon: "📚" },
{ href: "/playground", label: "Playground", icon: "🧩" },
{ href: "/health", label: "Health", icon: "❤️" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-bloom-gray hover:bg-bloom-violet/10 hover:text-bloom-violet transition-all duration-200"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="hidden lg:block font-medium text-sm">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Ada - AI Mentor */}
          <div className="glass-card rounded-xl p-3 lg:p-4 hidden lg:flex items-center gap-3 cursor-pointer hover:scale-105 transition-all">
            <span className="text-2xl">🧑‍🏫</span>
            <div>
              <p className="text-xs font-semibold text-bloom-navy">Ada</p>
              <p className="text-xs text-bloom-gray">AI Mentor</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {/* Top Bar */}
          <header className="flex items-center justify-between mb-8">
            <div>
              <p className="text-sm text-bloom-gray">Good evening, Blooming Coder 👋</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-gradient-to-r from-bloom-amber to-bloom-pink text-white text-xs font-semibold px-3 py-1.5 rounded-button flex items-center gap-1">
                🔥 7 Day Streak
              </span>
              <span className="text-xl cursor-pointer">🔔</span>
              <span className="w-10 h-10 rounded-full bg-gradient-to-br from-bloom-violet to-bloom-blue flex items-center justify-center text-white font-bold text-sm">
                E
              </span>
            </div>
          </header>

          {children}
        </main>
      </body>
    </html>
  );
}