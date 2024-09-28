"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mid = mid;
const promises_1 = __importDefault(require("fs/promises"));
const app_root_path_1 = __importDefault(require("app-root-path"));
const path_1 = __importDefault(require("path"));
const loading_cli_1 = __importDefault(require("loading-cli"));
const fetch_text_1 = require("../../src/lib/fetch_text");
async function mid() {
    const log = (0, loading_cli_1.default)("loading ...").start();
    log.info("Installing middleware...");
    await promises_1.default.mkdir(path_1.default.join(app_root_path_1.default.path, "src"), { recursive: true });
    const targetPath = path_1.default.join(process.cwd(), "src", "middleware.ts");
    const textFile = await (0, fetch_text_1.fetchFileContent)("wibu", "assets/middleware.txt");
    await promises_1.default.writeFile(targetPath, textFile);
    log.succeed("Middleware installed");
}
