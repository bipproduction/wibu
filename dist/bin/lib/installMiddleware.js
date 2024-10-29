"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installMiddleware = installMiddleware;
const path_1 = __importDefault(require("path"));
const installApp_1 = require("../util/installApp");
const WibuLog_1 = require("../util/WibuLog");
const AppUtils_1 = require("../util/AppUtils");
async function installMiddleware() {
    const assetRoot = path_1.default.join(AppUtils_1.AppUtils.appPath, "assets");
    const middlewareAssetRoot = path_1.default.join(assetRoot, "middleware");
    (0, installApp_1.installApp)({
        sourceDir: middlewareAssetRoot,
        supportPackages: "@prisma/client web-push @types/web-push @hookstate/core",
    })
        .catch((e) => {
        WibuLog_1.WibuLog.log().fail(e);
    })
        .finally(() => {
        WibuLog_1.WibuLog.log().succeed("middleware installed");
        WibuLog_1.WibuLog.log().stop();
        process.exit();
    });
}
