"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wibuAiChat = wibuAiChat;
async function wibuAiChat({ url = "https://wibu-ai.wibudev.com/api/chat", model = "tinyllama", token, systemContent = "you are a helpful assistant", userContent }) {
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            model: model,
            messages: [
                {
                    role: "system",
                    content: systemContent
                },
                {
                    role: "user",
                    content: userContent
                }
            ],
            stream: false
        })
    });
    const dataText = await res.text();
    try {
        const dataJson = JSON.parse(dataText);
        return dataJson.message.content;
    }
    catch (error) {
        console.log(error);
        return dataText;
    }
}