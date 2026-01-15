import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromCookie } from "@/lib/auth";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  const quiz = await prisma.quiz.findUnique({ where: { id }, include: { questions: true } });
  if (!quiz) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Include the correct answer field in the questions
  const quizWithCorrect = {
    ...quiz,
    questions: quiz.questions.map(q => ({
      id: q.id,
      text: q.text,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correct: q.correct,
    })),
  };

  return NextResponse.json({ quiz: quizWithCorrect });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromCookie();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: idParam } = await params;
  const id = Number(idParam);

  const quiz = await prisma.quiz.findUnique({ where: { id } });
  if (!quiz) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (quiz.authorId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Delete related records first
  await prisma.attempt.deleteMany({ where: { quizId: id } });
  await prisma.question.deleteMany({ where: { quizId: id } });
  await prisma.quiz.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
