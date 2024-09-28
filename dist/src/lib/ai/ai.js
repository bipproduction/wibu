"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ai = ai;
const crypto_js_1 = __importDefault(require("crypto-js"));
const openai_1 = __importDefault(require("openai"));
async function ai(system, user, onStream) {
    try {
        let result = "";
        const textToken = "U2FsdGVkX19ocSJBfOvbzIXRYaJM6HSJDjuA94ZxrLDx+ccyCOpvi8DpL7RzWPC0P+BIiLL8F0MhnsqIBvJDE3H6tj4RkNCgdor7WSD0yDs=";
        const key = "makuro";
        const token = crypto_js_1.default.AES.decrypt(textToken, key).toString(crypto_js_1.default.enc.Utf8);
        const openai = new openai_1.default({ apiKey: token });
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: system
                },
                {
                    role: "user",
                    content: user
                }
            ],
            stream: true
        });
        for await (const chunk of completion) {
            result += chunk.choices[0].delta.content;
            if (onStream) {
                await onStream(chunk.choices[0].delta.content);
            }
        }
        if (result === "") {
            console.log("no result");
            return null;
        }
        return result;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}
