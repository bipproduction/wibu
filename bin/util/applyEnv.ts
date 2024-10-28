import { exec } from "child_process";
import { promisify } from "util";
import { WibuLog } from "./WibuLog";
const execPromise = promisify(exec);

export async function applyEnv() {
  const targetPath = process.cwd();
  WibuLog.log().start("generate env ...");
  await execPromise("npx wibu gen-env", { cwd: targetPath });
}
