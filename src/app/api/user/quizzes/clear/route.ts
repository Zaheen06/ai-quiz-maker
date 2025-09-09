import { NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function DELETE() {
  try {
    const user = await getUserFromCookie();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use a transaction to ensure atomicity and proper foreign key handling
    await prisma.$transaction(async (tx) => {
      // Find all quiz IDs for the user
      const quizzes = await tx.quiz.findMany({
        where: { authorId: user.id },
        select: { id: true },
      });
      const quizIds = quizzes.map(q => q.id);

      if (quizIds.length > 0) {
        // Delete all attempts related to these quizzes (must be first due to foreign key)
        await tx.attempt.deleteMany({
          where: { quizId: { in: quizIds } },
        });

        // Delete all questions related to these quizzes
        await tx.question.deleteMany({
          where: { quizId: { in: quizIds } },
        });

        // Delete all quizzes for the current user
        // Use raw query with CASCADE to handle foreign key constraints properly
        // MySQL does not support CASCADE in DELETE statement, so delete quizzes individually
        for (const quizId of quizIds) {
          await tx.$executeRaw`DELETE FROM quiz WHERE id = ${quizId}`;
        }
      }
    });

    return NextResponse.json({ message: "All quizzes cleared successfully" });
  } catch (error: any) {
    console.error("Error clearing quizzes:", error);
    return NextResponse.json(
      { error: error.message || "Failed to clear quizzes" },
      { status: 500 }
    );
  }
}
