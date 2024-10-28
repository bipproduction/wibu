"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppVersion = getAppVersion;
const getAppPackage_1 = require("./getAppPackage");
const WibuLog_1 = require("./WibuLog");
async function getAppVersion() {
    const { version } = await (0, getAppPackage_1.getAppPackage)();
    WibuLog_1.WibuLog.log().succeed("app version: " + version);
    return version;
}
