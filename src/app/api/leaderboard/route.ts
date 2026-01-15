import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
    try {
        const attempts = await prisma.attempt.findMany({
            take: 20,
            orderBy: [
                { score: 'desc' },
                { createdAt: 'desc' }
            ],
            include: {
                user: { select: { name: true, email: true } },
                quiz: { select: { topic: true, difficulty: true } }
            }
        });
        return NextResponse.json({ attempts });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
    }
}
