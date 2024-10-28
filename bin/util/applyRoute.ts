
import {exec} from 'child_process'
import {promisify} from 'util'
import { WibuLog } from './WibuLog';
const execPromise = promisify(exec);

export async function applyRoute() {
    const targetPath = process.cwd();
    WibuLog.log().start("generate route ...");
    await execPromise("npx wibu gen-route", { cwd: targetPath });
  }