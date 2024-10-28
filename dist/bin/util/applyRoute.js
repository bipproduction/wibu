"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyRoute = applyRoute;
const child_process_1 = require("child_process");
const util_1 = require("util");
const WibuLog_1 = require("./WibuLog");
const execPromise = (0, util_1.promisify)(child_process_1.exec);
async function applyRoute() {
    const targetPath = process.cwd();
    WibuLog_1.WibuLog.log().start("generate route ...");
    await execPromise("npx wibu gen-route", { cwd: targetPath });
}
