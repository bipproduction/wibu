"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installSupportPackage = installSupportPackage;
const child_process_1 = require("child_process");
const util_1 = require("util");
const WibuLog_1 = require("./WibuLog");
const execPromise = (0, util_1.promisify)(child_process_1.exec);
async function installSupportPackage({ supportPackages }) {
    const targetRoot = process.cwd();
    WibuLog_1.WibuLog.log.start("installing support package ...");
    await execPromise(`yarn add ${supportPackages}`, { cwd: targetRoot });
}
