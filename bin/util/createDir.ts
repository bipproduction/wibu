import readdirp from "readdirp";
import path from "path";
import fs from "fs/promises";
import { WibuLog } from "./WibuLog";

export async function createDir({ sourceDir }: { sourceDir: string }) {
  WibuLog.log.start("creating dir ...");
  for await (const entry of readdirp(sourceDir, {
    type: "directories"
  })) {
    const dir = entry.path;
    const targetRoot = process.cwd();
    await fs.mkdir(path.join(targetRoot, dir), { recursive: true });
    WibuLog.log.start(dir);
  }
}
