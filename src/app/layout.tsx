import "../styles/globals.css";
import Link from "next/link";

export const metadata = { title: "AI Quiz Maker", description: "Generate quizzes with Gemini" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="nav">
          <Link href="/" className="font-bold text-xl gradient-text">QuizNest</Link>
          <nav className="flex gap-6 text-sm">
            <Link href="/dashboard" className="text-foreground hover:text-accent transition-colors duration-200 font-medium">Dashboard</Link>
            <Link href="/auth/login" className="text-foreground hover:text-accent transition-colors duration-200 font-medium">Login</Link>
            <Link href="/auth/signup" className="text-foreground hover:text-accent transition-colors duration-200 font-medium">Sign up</Link>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
