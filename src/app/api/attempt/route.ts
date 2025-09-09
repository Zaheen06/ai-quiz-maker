import { NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  quizId: z.number(),
  answers: z.record(z.string(), z.string()), // { [questionId]: "A" | "B" | "C" | "D" }
});

export async function POST(req: Request) {
  const user = await getUserFromCookie();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { quizId, answers } = schema.parse(await req.json());
  const quiz = await prisma.quiz.findUnique({ where: { id: quizId }, include: { questions: true } });
  if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

  let score = 0;
  for (const q of quiz.questions) {
    const ans = answers[String(q.id)];
    if (ans && ans === q.correct) score++;
  }

  const attempt = await prisma.attempt.create({
    data: {
      quizId,
      userId: user.id,
      score,
      total: quiz.questions.length,
      answers: answers as any,
    },
  });

  return NextResponse.json({ attempt });
}
