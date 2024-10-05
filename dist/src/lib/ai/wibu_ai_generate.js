"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wibuAiGenerate = wibuAiGenerate;
async function wibuAiGenerate({ model = "tinyllama", token, text, url = "https://wibu-ai.wibudev.com/api/generate", }) {
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            model: model,
            prompt: text,
            stream: false
        })
    });
    const dataText = await res.text();
    try {
        const dataJson = JSON.parse(dataText);
        return dataJson.response;
    }
    catch (error) {
        console.log(error);
        return dataText;
    }
}
