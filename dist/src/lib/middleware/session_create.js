"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionCreate = sessionCreate;
const headers_1 = require("next/headers");
const encrypt_1 = require("./encrypt");
async function sessionCreate({ sessionKey, exp = "7 year", encodedKey, user }) {
    const token = await (0, encrypt_1.encrypt)({
        exp,
        encodedKey,
        user
    });
    const cookie = {
        key: sessionKey,
        value: token,
        options: {
            httpOnly: true,
            sameSite: "lax",
            path: "/"
        }
    };
    (0, headers_1.cookies)().set(cookie.key, cookie.value, { ...cookie.options });
    return token;
}
