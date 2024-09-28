import fs from "fs/promises";
import appPath from "app-root-path";
import path from "path";
import loading from "loading-cli";
import { fetchFileContent } from "../../src/lib/fetch_text";

export async function mid() {
  const log = loading("loading ...").start();
  log.info("Installing middleware...");
  await fs.mkdir(path.join(appPath.path, "src"), { recursive: true });
  const targetPath = path.join(process.cwd(), "src", "middleware.ts");
  const textFile = await fetchFileContent("wibu", "assets/middleware.txt");
  await fs.writeFile(targetPath, textFile);
  log.succeed("Middleware installed");
}
