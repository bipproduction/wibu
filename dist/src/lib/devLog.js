"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.devLog = void 0;
const devLog = (log = false) => (text) => {
    if (log) {
        const stack = new Error().stack;
        const lineInfo = stack?.split("\n")[2]; // Ambil baris ke-2 dari stack trace
        const match = lineInfo?.match(/(\/.*:\d+:\d+)/); // Regex untuk mengambil file, baris, dan kolom
        const lineNumber = match ? match[1] : "unknown line";
        console.log(`[${lineNumber}] ==>`, text);
    }
};
exports.devLog = devLog;
