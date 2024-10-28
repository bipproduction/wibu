import { path as appPath } from "app-root-path";
import path from "path";
import { installApp } from "../util/installApp";
import { WibuLog } from "../util/WibuLog";

const assetRoot = path.join(appPath, "assets");
const middlewareAssetRoot = path.join(assetRoot, "middleware");

export async function installMiddleware() {
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


