"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installApp = installApp;
const applyEnv_1 = require("./applyEnv");
const applyRoute_1 = require("./applyRoute");
const createDir_1 = require("./createDir");
const installModule_1 = require("./installModule");
const installSupportPackage_1 = require("./installSupportPackage");
const installWibuPackage_1 = require("./installWibuPackage");
async function installApp({ supportPackages, sourceDir }) {
    await (0, installWibuPackage_1.installWibuPackage)();
    await (0, installSupportPackage_1.installSupportPackage)({
        supportPackages
    });
    await (0, createDir_1.createDir)({ sourceDir });
    await (0, installModule_1.installModule)({ sourceDir });
    await (0, applyRoute_1.applyRoute)();
    await (0, applyEnv_1.applyEnv)();
}
