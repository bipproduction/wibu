import { exec } from "child_process";
import { promisify } from "util";
import { WibuLog } from "./WibuLog";
const execPromise = promisify(exec);

export async function installSupportPackage({
  supportPackages
}: {
  supportPackages: string;
}) {
  const targetRoot = process.cwd();
  WibuLog.log.start("installing support package ...");
  await execPromise(`yarn add ${supportPackages}`, { cwd: targetRoot });
}
