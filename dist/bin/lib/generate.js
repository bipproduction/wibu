"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.realtime = realtime;
const promises_1 = __importDefault(require("fs/promises"));
const loading_cli_1 = __importDefault(require("loading-cli"));
const path_1 = __importDefault(require("path"));
const compileTypeScript_1 = require("../../src/lib/compileTypeScript");
const root = process.cwd();
async function realtime() {
    const log = (0, loading_cli_1.default)("installing ...").start();
    await promises_1.default.mkdir(path_1.default.join(root, "src/lib"), { recursive: true });
    await promises_1.default.mkdir(path_1.default.join(root, "src/types"), { recursive: true });
    const text = await fetchFileContent("assets/useWibuRealtime.txt");
    const compilet = (0, compileTypeScript_1.compileTypeScript)(text);
    promises_1.default.writeFile(path_1.default.join(root, "src/lib/useWibuRealtime.js"), compilet?.code, "utf8");
    promises_1.default.writeFile(path_1.default.join(root, "src/types/useWibuRealtime.d.ts"), compilet?.types, "utf8");
    log.succeed("realtime generated");
    log.stop();
}
async function fetchFileContent(filePath) {
    const response = await fetch(`https://raw.githubusercontent.com/bipproduction/wibu/main/${filePath}`);
    return response.text();
}
