"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.install = install;
exports.uninstall = uninstall;
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const listPath = [
    "public/wibu_worker.js",
    "src/app/manifest.ts",
    "src/lib/prisma.ts",
    "src/lib/urlB64ToUint8Array.ts",
    "src/lib/usePushNotifications.ts",
    "src/lib/usePWAInstall.ts",
    "src/app/api/get-subscribe/route.ts",
    "src/app/api/send-notification/route.ts",
    "src/app/api/set-subscribe/route.ts",
    "src/app/api/unsubscribe/route.ts",
    "public/icon-192x192.png"
];
async function install() {
    const totalFiles = listPath.length;
    let processedFiles = 0;
    for (const filePath of listPath) {
        await processFile(filePath);
        processedFiles++;
    }
    console.log("Install process completed!");
}
async function uninstall() {
    const totalFiles = listPath.length;
    let processedFiles = 0;
    for (const filePath of listPath) {
        await deleteFile(filePath);
        processedFiles++;
    }
    console.log("Uninstall process completed!");
}
async function processFile(filePath) {
    const fullPath = path_1.default.join(process.cwd(), filePath);
    try {
        const fileExists = await promises_1.default.access(fullPath).then(() => true).catch(() => false);
        if (fileExists) {
            console.log(filePath, "File already exists");
        }
        else {
            const isImage = checkIfImage(filePath);
            if (isImage) {
                const imageBuffer = await fetchImage(filePath);
                await createFile(fullPath, imageBuffer, true);
                console.log(filePath, "Image file created successfully");
            }
            else {
                const text = await fetchFileContent(filePath);
                await createFile(fullPath, text);
                console.log(filePath, "Text file created successfully");
            }
        }
    }
    catch (error) {
        console.error("Error processing", filePath, ":", error);
    }
}
async function deleteFile(filePath) {
    const fullPath = path_1.default.join(process.cwd(), filePath);
    try {
        const fileExists = await promises_1.default.access(fullPath).then(() => true).catch(() => false);
        if (fileExists) {
            await promises_1.default.unlink(fullPath); // Hapus file
            console.log(filePath, "File deleted successfully");
        }
        else {
            console.log(filePath, "File does not exist");
        }
    }
    catch (error) {
        console.error("Error deleting", filePath, ":", error);
    }
    try {
        const dirPath = path_1.default.dirname(fullPath);
        await promises_1.default.rmdir(dirPath, { recursive: false }); // Hanya hapus jika direktori kosong
    }
    catch (err) {
        if (err.code !== "ENOTEMPTY" && err.code !== "ENOENT") {
            console.error(`Error deleting directory: ${path_1.default.dirname(fullPath)}`, err);
        }
    }
}
function checkIfImage(filePath) {
    const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".bmp"];
    return imageExtensions.some((ext) => filePath.endsWith(ext));
}
async function fetchFileContent(filePath) {
    const response = await fetch(`https://raw.githubusercontent.com/bipproduction/webpush-example/main/${filePath}`);
    return response.text();
}
async function fetchImage(filePath) {
    const response = await fetch(`https://raw.githubusercontent.com/bipproduction/webpush-example/main/${filePath}`);
    return response.arrayBuffer();
}
async function createFile(fullPath, content, isBinary = false) {
    await promises_1.default.mkdir(path_1.default.dirname(fullPath), { recursive: true });
    if (isBinary) {
        await promises_1.default.writeFile(fullPath, Buffer.from(content)); // Menulis file gambar dalam bentuk biner
    }
    else {
        await promises_1.default.writeFile(fullPath, content); // Menulis file teks
    }
}
