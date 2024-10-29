import path from "path";
import { path as appRootPath } from "app-root-path"; 
import fs from "fs/promises";

// Fungsi asinkron untuk mendapatkan root path aplikasi
async function getAppRoot() {
  const wibuPath = path.join(appRootPath, "node_modules", "wibu");

  try {
    // Cek apakah folder 'wibu' ada di dalam 'node_modules'
    await fs.access(wibuPath);
    return wibuPath;
  } catch (error) {
    // Jika folder 'wibu' tidak ditemukan, kembalikan root path aplikasi
    return appRootPath;
  }
}

export class AppUtils {
  private static _resolvedAppPath: string | null = null;

  // Getter untuk appPath, akan memunculkan warning jika belum diinisialisasi
  public static get appPath(): string {
    if (!this._resolvedAppPath) {
      throw new Error("AppUtils has not been initialized. Please call `AppUtils.init()` first.");
    }
    return this._resolvedAppPath;
  }

  // Metode untuk inisialisasi dan cache root path
  public static async init(): Promise<string> {
    if (!this._resolvedAppPath) {
      this._resolvedAppPath = await getAppRoot();
    }
    return this._resolvedAppPath;
  }
}
