import { exec } from "child_process";
import dedent from "dedent";
import { promisify } from "util";
import { getAppVersion } from "./getAppVersion";
import { getWibuPackage } from "./getWibuPackage";
import { WibuLog } from "./WibuLog";
const execPromise = promisify(exec);

export async function installWibuPackage() {
  const targetRoot = process.cwd();
  const appVersion = await getAppVersion();
  WibuLog.log.start("update wibu ...");
  const wibuPackage = await getWibuPackage();
  const installText = wibuPackage
    ? "yarn remove wibu && yarn add bipproduction/wibu"
    : "yarn add bipproduction/wibu";
  await execPromise(installText, { cwd: targetRoot });
  WibuLog.log.succeed("wibu installed");

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
