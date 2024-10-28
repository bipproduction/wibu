"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWibuPackage = getWibuPackage;
const getAppPackage_1 = require("./getAppPackage");
const WibuLog_1 = require("./WibuLog");
async function getWibuPackage() {
    WibuLog_1.WibuLog.log.start("checking wibu package ...");
    const { dependencies } = await (0, getAppPackage_1.getAppPackage)();
    if (!dependencies["wibu"]) {
        return false;
    }
    return true;
}
