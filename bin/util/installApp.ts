import { applyEnv } from "./applyEnv";
import { applyRoute } from "./applyRoute";
import { createDir } from "./createDir";
import { installModule } from "./installModule";
import { installSupportPackage } from "./installSupportPackage";
import { installWibuPackage } from "./installWibuPackage";

export async function installApp({
  supportPackages,
  sourceDir
}: {
  supportPackages: string;
  sourceDir: string;
}) {
  await installWibuPackage();
  await installSupportPackage({
    supportPackages
  });
  await createDir({ sourceDir });
  await installModule({ sourceDir });
  await applyRoute();
  await applyEnv();
}
