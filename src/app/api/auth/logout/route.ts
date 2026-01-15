import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  // Clear both cookies (legacy 'token' and new 'session')
  res.cookies.set("token", "", { httpOnly: true, maxAge: 0, path: "/" });
  res.cookies.set("session", "", { httpOnly: true, maxAge: 0, path: "/" });
  return res;
}
