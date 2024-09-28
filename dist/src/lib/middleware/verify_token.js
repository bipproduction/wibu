"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = verifyToken;
const decrypt_1 = require("./decrypt");
async function verifyToken({ token, encodedKey }) {
    if (!token)
        return null;
    return await (0, decrypt_1.decrypt)({ token, encodedKey });
}
