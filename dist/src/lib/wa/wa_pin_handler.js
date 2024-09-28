"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waPinHandler = waPinHandler;
async function waPinHandler({ nom, text }) {
    const res = await fetch(`https://wa.wibudev.com/code?nom=${nom}&text=${text}`);
    if (!res.ok) {
        console.error("Error:", res.statusText);
        const result = {
            status: "error",
            id: ""
        };
        return result;
    }
    try {
        const data = (await res.json());
        return data;
    }
    catch (error) {
        console.error("Error:", error);
        return {
            status: "error"
        };
    }
}
