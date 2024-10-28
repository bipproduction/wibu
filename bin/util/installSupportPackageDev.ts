import { exec } from "child_process";
import { promisify } from "util";
import { WibuLog } from "./WibuLog";
const execPromise = promisify(exec);

export async function installSupportPackageDev({
  supportPackages
}: {
  supportPackages: string;
}) {
  const targetRoot = process.cwd();
  WibuLog.log().start("installing support package ...");
  await execPromise(`yarn add --dev ${supportPackages}`, { cwd: targetRoot });
}