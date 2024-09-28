"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const baseURL = "https://api.aimlapi.com/v1";
const apiKey = process.env.ML_API_KEY;
const systemPrompt = "You are a travel agent. Be descriptive and helpful";
const userPrompt = "Tell me about San Francisco";
const api = new openai_1.default({
    apiKey,
    baseURL
});
// const main = async () => {
//   const completion = await api.chat.completions.create({
//     model: "gpt-4o",
//     messages: [
//       {
//         role: "system",
//         content: systemPrompt
//       },
//       {
//         role: "user",
//         content: userPrompt
//       }
//     ],
//     temperature: 0.7,
//     max_tokens: 256,
//     stream: true
//   });
// //   const response = completion.choices[0].message.content;
//   console.log("User:", userPrompt);
// //   console.log("AI:", response);
// };
fetch("https://api.aimlapi.com/chat/completions", {
    method: "POST",
    headers: {
        Authorization: "Bearer 30bcb57df67b4d8496cde071bc3a4435",
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        model: "gpt-4o",
        messages: [
            {
                role: "user",
                content: "What kind of model are you?",
            },
        ],
        max_tokens: 512,
        stream: false,
    }),
})
    .then((res) => res.json())
    .then((data) => console.log(JSON.stringify(data, null, 2)));
