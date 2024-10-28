"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installModule = installModule;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const readdirp_1 = __importDefault(require("readdirp"));
const WibuLog_1 = require("./WibuLog");
async function installModule({ sourceDir }) {
    const targetRoot = process.cwd();
    WibuLog_1.WibuLog.log().start("installing middleware ...");
    for await (const entry of (0, readdirp_1.default)(sourceDir)) {
        const filePath = entry.fullPath;
        const finalPath = entry.path.replace(".wibu", "");
        await promises_1.default.copyFile(filePath, path_1.default.join(targetRoot, finalPath));
        WibuLog_1.WibuLog.log().succeed(finalPath);
    }
}
