import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import crypto from "crypto-js";
dotenv.config();

const textKey =
  "U2FsdGVkX19lspkQw64Qgf7x8+JO44BB3mvw/u/Qu4ViUKKZbFGXG6ojRXHbn+uUFdfjCgaxiesO1CdcVjnx4w==";
const GEMINI_API = crypto.AES.decrypt(textKey, "makuro").toString(
  crypto.enc.Utf8
);
export async function geminiAi({
  system,
  user,
  onStream
}: {
  system: string;
  user: string;
  onStream?: (data: string | null | undefined) => void;
}) {
  if (!GEMINI_API) throw new Error("GEMINI_API is not defined");
  const genAI = new GoogleGenerativeAI(GEMINI_API);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
  ${system}

  berikut adalah tugas yang harus anda kerjakan:
  ${user}
  `;

  const result = await model.generateContentStream(prompt);
  let hasil = "";

  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    if (onStream) {
      onStream(chunkText);
    }
    hasil += chunkText;
  }
  const arrayText = hasil.split("\n");
  if (arrayText.length > 2) {
    arrayText.pop();
    arrayText.shift();
  }

  return arrayText.join("\n");
}
