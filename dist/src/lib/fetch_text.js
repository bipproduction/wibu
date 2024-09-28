"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchFileContent = fetchFileContent;
async function fetchFileContent(repo, filePath) {
    const response = await fetch(`https://raw.githubusercontent.com/bipproduction/${repo}/main/${filePath}`);
    return response.text();
}
