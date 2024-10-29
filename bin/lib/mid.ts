import fs from "fs/promises";
import path from "path";
import loading from "loading-cli";
import { fetchFileContent } from "../../src/lib/fetch_text";
import { AppUtils } from "../util/AppUtils";

export async function mid() {
  const log = loading("loading ...").start();
  log.info("Installing middleware...");
  await fs.mkdir(path.join(AppUtils.appPath, "src"), { recursive: true });
  const targetPath = path.join(process.cwd(), "src", "middleware.ts");
  const textFile = await fetchFileContent("wibu", "assets/middleware.txt");
  await fs.writeFile(targetPath, textFile);
  log.succeed("Middleware installed");
}
