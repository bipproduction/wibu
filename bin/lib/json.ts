import { ai } from "../../src/lib/ai/ai";
import path from "path";
import fs from "fs/promises";

const systemPrompt = `
You are a JSON generator
The output must be a valid JSON array with the correct number of entries, without any explanations, comments, or markdown formatting.
`;
export async function json(text: string) {
  console.log("generating json ...");
  const result = await ai(systemPrompt, `buatkan saya ${text} objek`);
  await fs.writeFile(path.join(process.cwd(), "json.json"), result!, "utf8");
  console.log("json generated");
}
