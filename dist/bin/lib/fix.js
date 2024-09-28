"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fix = fix;
const ai_1 = require("../../src/lib/ai/ai");
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const systemPrompt = `
You are a programming assistant who is an expert in TypeScript. Your job is to:
1. Provide the best solution for the given code, including performance optimizations, logic fixes, or code quality improvements.
2. Create additional functions if needed to improve modularity, efficiency, and maintainability.
3. Simplify the code in any relevant way, including reducing redundancy, improving structure, and using appropriate patterns to make it easier to maintain.
4. Avoid adding unnecessary comments. If there are comments, make sure they are short and clear.
5. Your answer should only contain the corrected code, without any explanation or other formatting.
6. Write the code you provide in TypeScript.
Provide the best results that can be used directly in the TypeScript environment.
Result should be in TypeScript. Do not include any explanations, comments, or markdown formatting (no backticks, no code blocks, no markdown at all).

`;
async function fix(pathText, replace) {
    console.log("load data ...");
    const text = await promises_1.default.readFile(pathText, "utf8");
    console.log("processing ...");
    const result = await (0, ai_1.ai)(systemPrompt, text);
    if (!result || result === "invalid") {
        console.log(" no result or invalid type");
        return;
    }
    const dir = path_1.default.dirname(pathText);
    const ext = path_1.default.extname(pathText);
    const name = path_1.default.basename(pathText, ext);
    if (replace) {
        return await promises_1.default.writeFile(pathText, result, "utf8");
    }
    await promises_1.default.writeFile(path_1.default.join(dir, `${name}.fix${ext}`), result, "utf8");
}
