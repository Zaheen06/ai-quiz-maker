import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getUserFromCookie } from "@/lib/auth";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function POST(req: Request) {
  try {
    const user = await getUserFromCookie();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const topic = body.topic?.trim();
    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const prompt = `
Generate 4 multiple-choice questions on the topic: "${topic}".
Each question must have:
- text
- optionA, optionB, optionC, optionD
- correct: one of "A", "B", "C", "D"
Return only valid JSON array.
`;

    // Call Gemini API
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    if (!text) throw new Error("No response from Gemini");

    // Try parsing JSON
    let questions;
    try {
      // Clean the response text to extract JSON array
      const jsonStart = text.indexOf('[');
      const jsonEnd = text.lastIndexOf(']');
      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error("Gemini response does not contain JSON array");
      }
      const jsonString = text.substring(jsonStart, jsonEnd + 1);
      questions = JSON.parse(jsonString);
    } catch {
      throw new Error("Gemini did not return valid JSON. Got: " + text);
    }

    // Save quiz in DB
    const quiz = await prisma.quiz.create({
      data: {
        topic,
        authorId: user.id,
        questions: {
          create: questions.map((q: any) => ({
            text: q.text,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correct: q.correct,
          })),
        },
      },
      include: { questions: true },
    });

    return NextResponse.json({ quiz });
  } catch (e: any) {
    console.error("Quiz generation error:", e);
    return NextResponse.json(
      { error: e.message || "Failed to generate quiz" },
      { status: 500 }
    );
  }
}
