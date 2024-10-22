"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installMiddleware = installMiddleware;
const readdirp_1 = __importDefault(require("readdirp"));
const path_1 = __importDefault(require("path"));
require("colors");
const app_root_path_1 = require("app-root-path");
const promises_1 = __importDefault(require("fs/promises"));
const loading_cli_1 = __importDefault(require("loading-cli"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const dedent_1 = __importDefault(require("dedent"));
const execSync = (0, util_1.promisify)(child_process_1.exec);
const assetRoot = path_1.default.join(app_root_path_1.path, "assets");
const targetRoot = process.cwd();
const middlewareRoot = path_1.default.join(assetRoot, "middleware");
const log = (0, loading_cli_1.default)("installing ...").start();
async function installMiddleware() {
    app()
        .catch((e) => {
        log.fail(e);
    })
        .finally(() => {
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
    for await (const entry of (0, readdirp_1.default)(path_1.default.join(assetRoot, "middleware"))) {
        const filePath = entry.fullPath;
        const finalPath = entry.path.replace(".wibu", "");
        await promises_1.default.copyFile(filePath, path_1.default.join(targetRoot, finalPath));
        log.info(finalPath);
    }
}
async function createDir() {
    for await (const entry of (0, readdirp_1.default)(middlewareRoot, {
        type: "directories"
    })) {
        const dir = entry.path;
        await promises_1.default.mkdir(path_1.default.join(targetRoot, dir), { recursive: true });
    }
}
async function installSupportPackage() {
    await execSync("yarn add prisma @prisma/client web-push @types/web-push @hookstate/core", { cwd: targetRoot });
}
async function installWibuPackage() {
    const appVersion = await getAppVersion();
    const remoteAppVersion = await getRemoteAppVersion();
    log.info("update wibu ...");
    const wibuPackage = await getWibuPackage();
    const installText = wibuPackage
        ? "yarn remove wibu && yarn add bipproduction/wibu"
        : "yarn add bipproduction/wibu";
    await execSync(installText, { cwd: targetRoot });
    log.succeed("wibu installed");
    if (appVersion !== remoteAppVersion) {
        console.log((0, dedent_1.default) `
      ----------------------------------
      update wibu from ${appVersion} to ${remoteAppVersion}
      ----------------------------------
      silahkan ulangi
      `);
        process.exit();
    }
}
async function getWibuPackage() {
    const { dependencies } = await getAppPackage();
    if (!dependencies["wibu"]) {
        return false;
    }
    return true;
}
async function getAppPackage() {
    try {
        const dep = await promises_1.default.readFile(path_1.default.join(app_root_path_1.path, "package.json"), "utf8");
        const depJson = JSON.parse(dep);
        return depJson;
    }
    catch (error) {
        log.fail("package.json not found");
        process.exit();
    }
}
async function getRemoteAppVersion() {
    const remotePackage = await fetch("https://raw.githubusercontent.com/bipproduction/wibu/refs/heads/main/package.json");
    if (remotePackage.ok) {
        const remotePackageJson = await remotePackage.json();
        return remotePackageJson.version;
    }
    log.fail("remote package not found");
    process.exit();
}
async function getAppVersion() {
    const { version } = await getAppPackage();
    return version;
}
