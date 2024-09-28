"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.json = json;
const ai_1 = require("../../src/lib/ai/ai");
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const systemPrompt = `
You are a JSON generator
The output must be a valid JSON array with the correct number of entries, without any explanations, comments, or markdown formatting.
`;
async function json(text) {
    console.log("generating json ...");
    const result = await (0, ai_1.ai)(systemPrompt, `buatkan saya ${text} objek`);
    await promises_1.default.writeFile(path_1.default.join(process.cwd(), "json.json"), result, "utf8");
    console.log("json generated");
}
