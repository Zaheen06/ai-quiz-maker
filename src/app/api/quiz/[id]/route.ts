import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
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
