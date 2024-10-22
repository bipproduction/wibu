"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installMiddleware = installMiddleware;
const readdirp_1 = __importDefault(require("readdirp"));
const path_1 = __importDefault(require("path"));
require("colors");
const app_root_path_1 = require("app-root-path");
const promises_1 = __importDefault(require("fs/promises"));
const loading_cli_1 = __importDefault(require("loading-cli"));
const assetRoot = path_1.default.join(app_root_path_1.path, "assets");
const targetRoot = process.cwd();
const middlewareRoot = path_1.default.join(assetRoot, "middleware");
async function installMiddleware() {
    const log = (0, loading_cli_1.default)("loading ...").start();
    await promises_1.default.mkdir(path_1.default.join(targetRoot, "src", "lib", "auth"), {
        recursive: true
    });
    const adaConfig = await findNextConfig();
    if (!adaConfig) {
        return log.fail("not nextjs project");
    }
    for await (const entry of (0, readdirp_1.default)(middlewareRoot, {
        type: "directories"
    })) {
        const dir = entry.path;
        await promises_1.default.mkdir(path_1.default.join(targetRoot, dir), { recursive: true });
    }
    for await (const entry of (0, readdirp_1.default)(path_1.default.join(assetRoot, "middleware"))) {
        const filePath = entry.fullPath;
        const finalPath = entry.path.replace(".wibu", "");
        await promises_1.default.copyFile(filePath, path_1.default.join(targetRoot, finalPath));
        log.info(finalPath);
    }
    log.succeed("middleware installed");
    log.stop();
}
async function findNextConfig() {
    const ls = [];
    for await (const entry of (0, readdirp_1.default)(path_1.default.join(targetRoot), {
        depth: 1,
        fileFilter: (entry) => {
            return entry.basename.includes("next.config");
        }
    })) {
        const name = path_1.default.basename(entry.path);
        ls.push(name);
    }
    if (ls.length > 0) {
        return true;
    }
    return false;
}
async function getFiles(log) {
    for await (const entry of (0, readdirp_1.default)(path_1.default.join(assetRoot, "middleware"))) {
        const filePath = entry.fullPath;
        const finalPath = entry.path.replace(".wibu", "");
        await promises_1.default.copyFile(filePath, path_1.default.join(targetRoot, finalPath));
        log.info(finalPath);
    }
}
