import { path as appRootPath } from 'app-root-path';
import path from "path";
import { createDir } from "../util/createDir";
import { installModule } from "../util/installModule";
import { installSupportPackage } from "../util/installSupportPackage";
import { installSupportPackageDev } from '../util/installSupportPackageDev';

export async function installMantine() {
  await installSupportPackage({
    supportPackages: "@mantine/core @mantine/hooks"
  });

  await installSupportPackageDev({supportPackages: "postcss postcss-preset-mantine postcss-simple-vars"})
  await createDir({ sourceDir: process.cwd() });
  await installModule({ sourceDir: path.join(appRootPath, "assets/mantine") });
}
