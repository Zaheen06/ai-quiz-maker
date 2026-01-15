import "../styles/globals.css";
import "../styles/navbar.css";
import UserNav from "@/components/UserNav";
import Link from "next/link";

import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: "QuizNest - AI Quiz Maker",
  description: "Create AI-powered quizzes in seconds",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'QuizNest',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#6366f1',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <header className="nav">
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Link href="/" className="font-bold text-2xl gradient-text">
              QuizNest
            </Link>
            <Link href="/leaderboard" style={{ textDecoration: 'none', color: '#64748b', fontWeight: 600, fontSize: '0.95rem' }}>
              Leaderboard
            </Link>
          </div>
          <UserNav />
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
