"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrypt = encrypt;
const jose_1 = require("jose");
async function encrypt({ user, exp = "7 year", encodedKey }) {
    try {
        const enc = new TextEncoder().encode(encodedKey);
        return new jose_1.SignJWT({ user })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime(exp)
            .sign(enc);
    }
    catch (error) {
        console.error("Gagal mengenkripsi", error);
        return null;
    }
}
