"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.innstallPushNotification = innstallPushNotification;
require("colors");
const path_1 = __importDefault(require("path"));
const AppUtils_1 = require("../util/AppUtils");
const WibuLog_1 = require("../util/WibuLog");
const installApp_1 = require("../util/installApp");
async function innstallPushNotification() {
    const assetRoot = path_1.default.join(AppUtils_1.AppUtils.appPath, "assets");
    const targetRoot = process.cwd();
    const pushNotificationRoot = path_1.default.join(assetRoot, "push-notification");
    await (0, installApp_1.installApp)({
        sourceDir: pushNotificationRoot,
        supportPackages: "prisma @prisma/client web-push @types/web-push @hookstate/core"
    })
        .catch((e) => {
        WibuLog_1.WibuLog.log().fail(e);
    })
        .finally(() => {
        WibuLog_1.WibuLog.log().succeed("push notification installed");
        WibuLog_1.WibuLog.log().stop();
        process.exit();
    });
}
