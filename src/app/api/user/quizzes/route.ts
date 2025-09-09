import { NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const user = await getUserFromCookie();
  if (!user) return NextResponse.json({ quizzes: [] });
  const quizzes = await prisma.quiz.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, topic: true, createdAt: true },
  });
  return NextResponse.json({ quizzes });
}
