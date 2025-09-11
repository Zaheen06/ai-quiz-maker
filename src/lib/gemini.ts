import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY!;
export const genAI = new GoogleGenerativeAI(apiKey);

export async function generateQuizQuestions(topic: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
You are a quiz generator. Create exactly 8 multiple-choice questions on the topic: "${topic}".
For each question provide:
- question: one sentence
- options: four concise choices labeled A, B, C, D
- correct: one letter exactly among A, B, C, D

Return ONLY valid JSON:
{
  "questions": [
    { "question": "...", "A": "...", "B": "...", "C": "...", "D": "...", "correct": "A" },
    ...
  ]
}
`;

  const res = await model.generateContent(prompt);
  const text = res.response.text().trim();
  // Try to extract JSON safely
  const jsonStr = text.startsWith("{") ? text : text.slice(text.indexOf("{"));
  const data = JSON.parse(jsonStr);
  return data.questions as Array<{question: string; A: string; B: string; C: string; D: string; correct: "A"|"B"|"C"|"D"}>;
}
