import fs from "fs/promises";
import loading from "loading-cli";
import path from "path";
import appPath from "app-root-path";
import dotEnv from "dotenv";
import readdirp from "readdirp";
import "colors";
import { execSync } from "child_process";
import { WibuLog } from "../util/WibuLog";
import { installApp } from "../util/installApp";

const assetRoot = path.join(appPath.path, "assets");
const targetRoot = process.cwd();
const pushNotificationRoot = path.join(assetRoot, "push-notification");

export async function innstallPushNotification() {
  await installApp({
    sourceDir: pushNotificationRoot,
    supportPackages:
      "prisma @prisma/client web-push @types/web-push @hookstate/core"
  })
    .catch((e) => {
      WibuLog.log.fail(e);
    })
    .finally(() => {
      WibuLog.log.succeed("push notification installed");
      WibuLog.log.stop();
      process.exit();
    });
}

async function app() {
  execSync(
    "yarn add bipproduction/wibu prisma @prisma/client web-push @types/web-push @hookstate/core",
    { cwd: targetRoot }
  );
  const env = await fs.readFile(path.join(targetRoot, ".env"), "utf8");
  const envJson = dotEnv.parse(env);
  if (!envJson.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
    WibuLog.log.fail("NEXT_PUBLIC_VAPID_PUBLIC_KEY not set".red);
    return;
  }

  if (!envJson.VAPID_PRIVATE_KEY) {
    WibuLog.log.fail("VAPID_PRIVATE_KEY not set".red);
    return;
  }

  if (!envJson.WIBU_PUSH_DB_TOKEN) {
    WibuLog.log.fail("WIBU_PUSH_DB_TOKEN not set".red);
    return;
  }

  for await (const entry of readdirp(pushNotificationRoot, {
    type: "directories"
  })) {
    const dir = entry.path;
    await fs.mkdir(path.join(targetRoot, dir), { recursive: true });
  }

  for await (const entry of readdirp(pushNotificationRoot)) {
    const filePath = entry.fullPath;
    const finalPath = entry.path.replace(".wibu", "");
    await fs.copyFile(filePath, path.join(targetRoot, finalPath));
    WibuLog.log.info(finalPath);
  }

  WibuLog.log.succeed("wibu-worker installed");
  WibuLog.log.stop();
}
