"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.innstallPushNotification = innstallPushNotification;
const app_root_path_1 = __importDefault(require("app-root-path"));
require("colors");
const path_1 = __importDefault(require("path"));
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
        WibuLog_1.WibuLog.log().fail(e);
    })
        .finally(() => {
        WibuLog_1.WibuLog.log().succeed("push notification installed");
        WibuLog_1.WibuLog.log().stop();
        process.exit();
    });
}
// async function app() {
//   execSync(
//     "yarn add bipproduction/wibu prisma @prisma/client web-push @types/web-push @hookstate/core",
//     { cwd: targetRoot }
//   );
//   const env = await fs.readFile(path.join(targetRoot, ".env"), "utf8");
//   const envJson = dotEnv.parse(env);
//   if (!envJson.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
//     WibuLog.log().fail("NEXT_PUBLIC_VAPID_PUBLIC_KEY not set".red);
//     return;
//   }
//   if (!envJson.VAPID_PRIVATE_KEY) {
//     WibuLog.log().fail("VAPID_PRIVATE_KEY not set".red);
//     return;
//   }
//   if (!envJson.WIBU_PUSH_DB_TOKEN) {
//     WibuLog.log().fail("WIBU_PUSH_DB_TOKEN not set".red);
//     return;
//   }
//   for await (const entry of readdirp(pushNotificationRoot, {
//     type: "directories"
//   })) {
//     const dir = entry.path;
//     await fs.mkdir(path.join(targetRoot, dir), { recursive: true });
//   }
//   for await (const entry of readdirp(pushNotificationRoot)) {
//     const filePath = entry.fullPath;
//     const finalPath = entry.path.replace(".wibu", "");
//     await fs.copyFile(filePath, path.join(targetRoot, finalPath));
//     WibuLog.log().info(finalPath);
//   }
//   WibuLog.log().succeed("wibu-worker installed");
//   WibuLog.log().stop();
// }
