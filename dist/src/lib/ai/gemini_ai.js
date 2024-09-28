"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.geminiAi = geminiAi;
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
const crypto_js_1 = __importDefault(require("crypto-js"));
dotenv_1.default.config();
const textKey = "U2FsdGVkX19lspkQw64Qgf7x8+JO44BB3mvw/u/Qu4ViUKKZbFGXG6ojRXHbn+uUFdfjCgaxiesO1CdcVjnx4w==";
const GEMINI_API = crypto_js_1.default.AES.decrypt(textKey, "makuro").toString(crypto_js_1.default.enc.Utf8);
async function geminiAi({ system, user, onStream }) {
    if (!GEMINI_API)
        throw new Error("GEMINI_API is not defined");
    const genAI = new generative_ai_1.GoogleGenerativeAI(GEMINI_API);
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
