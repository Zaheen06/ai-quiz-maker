import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const session = req.cookies.get("session");
    const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");
    const isLeaderboard = req.nextUrl.pathname.startsWith("/leaderboard");
    const isQuiz = req.nextUrl.pathname.startsWith("/quiz");

    // Protect private routes
    if ((isDashboard || isLeaderboard || isQuiz) && !session) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Redirect authenticated users from login pages
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
    if (isAuthPage && session) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/quiz/:path*", "/leaderboard/:path*", "/auth/:path*"],
};
