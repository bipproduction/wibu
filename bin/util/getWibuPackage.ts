import { getAppPackage } from "./getAppPackage";
import { WibuLog } from "./WibuLog";

export async function getWibuPackage() {
  WibuLog.log.start("checking wibu package ...");
  const { dependencies } = await getAppPackage();
  if (!dependencies["wibu"]) {
    return false;
  }
  return true;
}
