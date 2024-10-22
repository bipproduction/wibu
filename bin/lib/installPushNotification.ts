import fs from "fs/promises";
import loading from "loading-cli";
import path from "path";
import appPath from "app-root-path";
import dotEnv from "dotenv";
import readdirp from "readdirp";
import "colors";
import { execSync } from "child_process";

const assetRoot = path.join(appPath.path, "assets");
const targetRoot = process.cwd();
const pushNotificationRoot = path.join(assetRoot, "push-notification");

export async function innstallPushNotification() {
  const log = loading("installing ...").start();
  execSync('yarn add bipproduction/wibu prisma @prisma/client web-push @types/web-push @hookstate/core', { cwd: targetRoot });
  const env = await fs.readFile(path.join(targetRoot, ".env"), "utf8");
  const envJson = dotEnv.parse(env);
  if (!envJson.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
    log.fail("NEXT_PUBLIC_VAPID_PUBLIC_KEY not set".red);
    return;
  }

  if (!envJson.VAPID_PRIVATE_KEY) {
    log.fail("VAPID_PRIVATE_KEY not set".red);
    return;
  }

  if (!envJson.WIBU_PUSH_DB_TOKEN) {
    log.fail("WIBU_PUSH_DB_TOKEN not set".red);
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
    log.info(finalPath);
  }

  log.succeed("wibu-worker installed");
  log.stop();
}
