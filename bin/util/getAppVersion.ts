import { getAppPackage } from "./getAppPackage";
import { WibuLog } from "./WibuLog";

export async function getAppVersion() {
  const { version } = await getAppPackage();
  WibuLog.log.succeed("app version: " + version);
  return version;
}
