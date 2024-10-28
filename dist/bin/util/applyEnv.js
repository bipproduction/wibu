"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyEnv = applyEnv;
const child_process_1 = require("child_process");
const util_1 = require("util");
const WibuLog_1 = require("./WibuLog");
const execPromise = (0, util_1.promisify)(child_process_1.exec);
async function applyEnv() {
    const targetPath = process.cwd();
    WibuLog_1.WibuLog.log().start("generate env ...");
    await execPromise("npx wibu gen-env", { cwd: targetPath });
}
