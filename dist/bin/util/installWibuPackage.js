"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installWibuPackage = installWibuPackage;
const child_process_1 = require("child_process");
const dedent_1 = __importDefault(require("dedent"));
const util_1 = require("util");
const getAppVersion_1 = require("./getAppVersion");
const getWibuPackage_1 = require("./getWibuPackage");
const WibuLog_1 = require("./WibuLog");
const execPromise = (0, util_1.promisify)(child_process_1.exec);
async function installWibuPackage() {
    const targetRoot = process.cwd();
    const appVersion = await (0, getAppVersion_1.getAppVersion)();
    WibuLog_1.WibuLog.log.start("update wibu ...");
    const wibuPackage = await (0, getWibuPackage_1.getWibuPackage)();
    const installText = wibuPackage
        ? "yarn remove wibu && yarn add bipproduction/wibu"
        : "yarn add bipproduction/wibu";
    await execPromise(installText, { cwd: targetRoot });
    WibuLog_1.WibuLog.log.succeed("wibu installed");
    const appCurrentVersion = await (0, getAppVersion_1.getAppVersion)();
    if (appVersion !== appCurrentVersion) {
        console.log((0, dedent_1.default) `
        ----------------------------------
        update wibu from ${appVersion} to ${appCurrentVersion}
        ----------------------------------
        silahkan ulangi
        `);
        process.exit();
    }
}
