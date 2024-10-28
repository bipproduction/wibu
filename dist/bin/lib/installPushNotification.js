"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.innstallPushNotification = innstallPushNotification;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const app_root_path_1 = __importDefault(require("app-root-path"));
const dotenv_1 = __importDefault(require("dotenv"));
const readdirp_1 = __importDefault(require("readdirp"));
require("colors");
const child_process_1 = require("child_process");
const WibuLog_1 = require("../util/WibuLog");
const installApp_1 = require("../util/installApp");
const assetRoot = path_1.default.join(app_root_path_1.default.path, "assets");
const targetRoot = process.cwd();
const pushNotificationRoot = path_1.default.join(assetRoot, "push-notification");
async function innstallPushNotification() {
    await (0, installApp_1.installApp)({
        sourceDir: pushNotificationRoot,
        supportPackages: "prisma @prisma/client web-push @types/web-push @hookstate/core"
    })
        .catch((e) => {
        WibuLog_1.WibuLog.log.fail(e);
    })
        .finally(() => {
        WibuLog_1.WibuLog.log.succeed("push notification installed");
        WibuLog_1.WibuLog.log.stop();
        process.exit();
    });
}
async function app() {
    (0, child_process_1.execSync)("yarn add bipproduction/wibu prisma @prisma/client web-push @types/web-push @hookstate/core", { cwd: targetRoot });
    const env = await promises_1.default.readFile(path_1.default.join(targetRoot, ".env"), "utf8");
    const envJson = dotenv_1.default.parse(env);
    if (!envJson.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
        WibuLog_1.WibuLog.log.fail("NEXT_PUBLIC_VAPID_PUBLIC_KEY not set".red);
        return;
    }
    if (!envJson.VAPID_PRIVATE_KEY) {
        WibuLog_1.WibuLog.log.fail("VAPID_PRIVATE_KEY not set".red);
        return;
    }
    if (!envJson.WIBU_PUSH_DB_TOKEN) {
        WibuLog_1.WibuLog.log.fail("WIBU_PUSH_DB_TOKEN not set".red);
        return;
    }
    for await (const entry of (0, readdirp_1.default)(pushNotificationRoot, {
        type: "directories"
    })) {
        const dir = entry.path;
        await promises_1.default.mkdir(path_1.default.join(targetRoot, dir), { recursive: true });
    }
    for await (const entry of (0, readdirp_1.default)(pushNotificationRoot)) {
        const filePath = entry.fullPath;
        const finalPath = entry.path.replace(".wibu", "");
        await promises_1.default.copyFile(filePath, path_1.default.join(targetRoot, finalPath));
        WibuLog_1.WibuLog.log.info(finalPath);
    }
    WibuLog_1.WibuLog.log.succeed("wibu-worker installed");
    WibuLog_1.WibuLog.log.stop();
}
