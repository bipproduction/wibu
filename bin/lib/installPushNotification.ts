import "colors";
import path from "path";
import { AppUtils } from "../util/AppUtils";
import { WibuLog } from "../util/WibuLog";
import { installApp } from "../util/installApp";

export async function innstallPushNotification() {
  const assetRoot = path.join(AppUtils.appPath, "assets");
  const targetRoot = process.cwd();
  const pushNotificationRoot = path.join(assetRoot, "push-notification");
  await installApp({
    sourceDir: pushNotificationRoot,
    supportPackages:
      "prisma @prisma/client web-push @types/web-push @hookstate/core"
  })
    .catch((e) => {
      WibuLog.log().fail(e);
    })
    .finally(() => {
      WibuLog.log().succeed("push notification installed");
      WibuLog.log().stop();
      process.exit();
    });
}
