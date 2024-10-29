
import path from "path";
import { installApp } from "../util/installApp";
import { WibuLog } from "../util/WibuLog";
import { AppUtils } from "../util/AppUtils";

export async function installMiddleware() {
  const assetRoot = path.join(AppUtils.appPath, "assets");
const middlewareAssetRoot = path.join(assetRoot, "middleware");
  installApp({
    sourceDir: middlewareAssetRoot,
    supportPackages: "@prisma/client web-push @types/web-push @hookstate/core",
  })
    .catch((e) => {
      WibuLog.log().fail(e);
    })
    .finally(() => {
      WibuLog.log().succeed("middleware installed");
      WibuLog.log().stop();
      process.exit();
    });
}


