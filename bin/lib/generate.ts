import dotenv from "dotenv";
import fs from "fs/promises";
import loading from "loading-cli";
import path from "path";
import { compileTypeScript } from "../../src/lib/compileTypeScript";
const root = process.cwd();



export async function realtime() {
  const log = loading("installing ...").start();
  await fs.mkdir(path.join(root, "src/lib"), { recursive: true });
  await fs.mkdir(path.join(root, "src/types"), { recursive: true });
  const text = await fetchFileContent("assets/useWibuRealtime.txt");
  const compilet = compileTypeScript(text);
  fs.writeFile(
    path.join(root, "src/lib/useWibuRealtime.js"),
    compilet?.code!,
    "utf8"
  );
  fs.writeFile(
    path.join(root, "src/types/useWibuRealtime.d.ts"),
    compilet?.types!,
    "utf8"
  );
  log.succeed("realtime generated");
  log.stop();
}

async function fetchFileContent(filePath: string): Promise<string> {
  const response = await fetch(
    `https://raw.githubusercontent.com/bipproduction/wibu/main/${filePath}`
  );
  return response.text();
}
