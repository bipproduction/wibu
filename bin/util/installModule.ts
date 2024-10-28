import fs from "fs/promises";
import path from 'path';
import readdirp from "readdirp";
import { WibuLog } from "./WibuLog";

export async function installModule({sourceDir}: { sourceDir: string }) {
    const targetRoot = process.cwd();
    WibuLog.log().start("installing middleware ...");
    for await (const entry of readdirp(sourceDir)) {
      const filePath = entry.fullPath;
      const finalPath = entry.path.replace(".wibu", "");
      await fs.copyFile(filePath, path.join(targetRoot, finalPath));
      WibuLog.log().succeed(finalPath);
    }
  }