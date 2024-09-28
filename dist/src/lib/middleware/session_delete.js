"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionDelete = sessionDelete;
const headers_1 = require("next/headers");
function sessionDelete({ sessionKey }) {
    const del = (0, headers_1.cookies)().delete(sessionKey);
    return del;
}
