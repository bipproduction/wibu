"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppPackage = getAppPackage;
const app_root_path_1 = require("app-root-path");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const WibuLog_1 = require("./WibuLog");
async function getAppPackage() {
    try {
        WibuLog_1.WibuLog.log().start("checking app package ...");
        const dep = await promises_1.default.readFile(path_1.default.join(app_root_path_1.path, "package.json"), "utf8");
        const depJson = JSON.parse(dep);
        return depJson;
    }
    catch (error) {
        WibuLog_1.WibuLog.log().fail("package.json not found");
        process.exit();
    }
}
