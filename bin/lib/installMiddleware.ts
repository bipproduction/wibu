import readdirp from "readdirp";
import path from "path";
import "colors";
import { path as appPath } from "app-root-path";
import fs from "fs/promises";
import loading from "loading-cli";
import { exec } from "child_process";
import { promisify } from "util";
import dedent from "dedent";
const execSync = promisify(exec);

const assetRoot = path.join(appPath, "assets");
const targetRoot = process.cwd();
const middlewareRoot = path.join(assetRoot, "middleware");

const log = loading("installing ...").start();
export async function installMiddleware() {
  app()
    .catch((e) => {
      log.fail(e);
    })
    .finally(() => {
      log.succeed("middleware installed");
      log.stop();
      process.exit();
    });
}

async function app() {
  await installWibuPackage();
  await installSupportPackage();
  await createDir();
  await installModule();
}

async function installModule() {
  log.start("installing middleware ...");
  for await (const entry of readdirp(path.join(assetRoot, "middleware"))) {
    const filePath = entry.fullPath;
    const finalPath = entry.path.replace(".wibu", "");
    await fs.copyFile(filePath, path.join(targetRoot, finalPath));
    log.start(finalPath);
  }
}

async function createDir() {
  log.start("creating dir ...");
  for await (const entry of readdirp(middlewareRoot, {
    type: "directories"
  })) {
    const dir = entry.path;
    await fs.mkdir(path.join(targetRoot, dir), { recursive: true });
    log.start(dir);
  }
}
async function installSupportPackage() {
  log.start("installing support package ...");
  await execSync(
    "yarn add prisma @prisma/client web-push @types/web-push @hookstate/core",
    { cwd: targetRoot }
  );
}
async function installWibuPackage() {
  const appVersion = await getAppVersion();
  log.start("update wibu ...");
  const wibuPackage = await getWibuPackage();
  const installText = wibuPackage
    ? "yarn remove wibu && yarn add bipproduction/wibu"
    : "yarn add bipproduction/wibu";
  await execSync(installText, { cwd: targetRoot });
  log.succeed("wibu installed");

  const appCurrentVersion = await getAppVersion();
  if (appVersion !== appCurrentVersion) {
    console.log(dedent`
      ----------------------------------
      update wibu from ${appVersion} to ${appCurrentVersion}
      ----------------------------------
      silahkan ulangi
      `);
    process.exit();
  }
}

async function getWibuPackage() {
  log.start("checking wibu package ...");
  const { dependencies } = await getAppPackage();
  if (!dependencies["wibu"]) {
    return false;
  }
  return true;
}

async function getAppPackage() {
  try {
    log.start("checking app package ...");
    const dep = await fs.readFile(path.join(appPath, "package.json"), "utf8");
    const depJson = JSON.parse(dep);
    return depJson;
  } catch (error) {
    log.fail("package.json not found");
    process.exit();
  }
}

async function getRemoteAppVersion(): Promise<string> {
  const remotePackage = await fetch(
    "https://raw.githubusercontent.com/bipproduction/wibu/refs/heads/main/package.json"
  );
  if (remotePackage.ok) {
    const remotePackageJson = await remotePackage.json();
    return remotePackageJson.version;
  }

  log.fail("remote package not found");
  process.exit();
}

async function getAppVersion() {
  log.start("checking app version ...");
  const { version } = await getAppPackage();
  return version;
}
