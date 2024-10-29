import readdirp from "readdirp";
import path from "path";
import fs from "fs/promises";
import packageJson from "../package.json";
import {path as appPath} from 'app-root-path'

(async () => {
  const appVersion = packageJson.version;
  for await (const entry of readdirp(path.join(appPath, "assets"))) {
    let fullPath = entry.fullPath;
    if(fullPath.includes(".png")) continue

    const readFile = await fs.readFile(fullPath, "utf8");
    const listText = readFile.split("\n");
    let index: number | null = null;
    listText.forEach((text, i) => {
      if (text.includes("// wibu:")) {
        index = i;
      }
    });

    if (index === null) {
      listText[listText.length] = `// wibu:${appVersion}`;
    } else {
      listText[index] = `// wibu:${appVersion}`;
    }

    const ext = path.extname(fullPath);
    if (ext !== ".wibu") {
        await fs.rename(fullPath, fullPath + ".wibu");
        fullPath = entry.fullPath + ".wibu";
      }
    await fs.writeFile(fullPath, listText.join("\n"), "utf8");
  }
  console.log("done");
})();
