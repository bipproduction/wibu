"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = decrypt;
const jose_1 = require("jose");
async function decrypt({ token, encodedKey }) {
    try {
        const enc = new TextEncoder().encode(encodedKey);
        const { payload } = await (0, jose_1.jwtVerify)(token, enc, {
            algorithms: ["HS256"]
        });
        return payload.user || null;
    }
    catch (error) {
        console.error("Gagal verifikasi session", error);
        return null;
    }
}
