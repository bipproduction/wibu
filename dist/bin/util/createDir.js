"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDir = createDir;
const readdirp_1 = __importDefault(require("readdirp"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const WibuLog_1 = require("./WibuLog");
async function createDir({ sourceDir }) {
    WibuLog_1.WibuLog.log.start("creating dir ...");
    for await (const entry of (0, readdirp_1.default)(sourceDir, {
        type: "directories"
    })) {
        const dir = entry.path;
        const targetRoot = process.cwd();
        await promises_1.default.mkdir(path_1.default.join(targetRoot, dir), { recursive: true });
        WibuLog_1.WibuLog.log.start(dir);
    }
}
