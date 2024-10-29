
import fs from "fs/promises";
import path from "path";
import { WibuLog } from "./WibuLog";
import { AppUtils } from "./AppUtils";

export async function getAppPackage() {
  try {
    WibuLog.log().start("checking app package ...");
    const dep = await fs.readFile(path.join(AppUtils.appPath, "package.json"), "utf8");
    const depJson = JSON.parse(dep);
    return depJson;
  } catch (error) {
    WibuLog.log().fail("package.json not found");
    process.exit();
  }
}
