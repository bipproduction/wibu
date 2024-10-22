import readdirp from "readdirp";
import path from "path";
import "colors";
import { path as appPath } from "app-root-path";
import fs from "fs/promises";
import loading from "loading-cli";

const assetRoot = path.join(appPath, "assets");
const targetRoot = process.cwd();
const middlewareRoot = path.join(assetRoot, "middleware");

export async function installMiddleware() {
  const log = loading("loading ...").start();

  await fs.mkdir(path.join(targetRoot, "src", "lib", "auth"), {
    recursive: true
  });

  const adaConfig = await findNextConfig();
  if (!adaConfig) {
    return log.fail("not nextjs project");
  }

  for await (const entry of readdirp(middlewareRoot, {
    type: "directories"
  })) {
    const dir = entry.path;
    await fs.mkdir(path.join(targetRoot, dir), { recursive: true });
  }

  for await (const entry of readdirp(path.join(assetRoot, "middleware"))) {
    const filePath = entry.fullPath;
    const finalPath = entry.path.replace(".wibu", "");

    await fs.copyFile(filePath, path.join(targetRoot, finalPath));
    log.info(finalPath);
  }

  log.succeed("middleware installed");
  log.stop();
}

async function findNextConfig() {
  const ls: string[] = [];
  for await (const entry of readdirp(path.join(targetRoot), {
    depth: 1,
    fileFilter: (entry) => {
      return entry.basename.includes("next.config");
    }
  })) {
    const name = path.basename(entry.path);
    ls.push(name);
  }
  if (ls.length > 0) {
    return true;
  }
  return false;
}

async function getFiles(log: loading.Loading) {
  for await (const entry of readdirp(path.join(assetRoot, "middleware"))) {
    const filePath = entry.fullPath;
    const finalPath = entry.path.replace(".wibu", "");

    await fs.copyFile(filePath, path.join(targetRoot, finalPath));
    log.info(finalPath);
  }
}
