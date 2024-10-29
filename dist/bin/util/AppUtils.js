"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppUtils = void 0;
const path_1 = __importDefault(require("path"));
const app_root_path_1 = require("app-root-path");
const promises_1 = __importDefault(require("fs/promises"));
// Fungsi asinkron untuk mendapatkan root path aplikasi
async function getAppRoot() {
    const wibuPath = path_1.default.join(app_root_path_1.path, "node_modules", "wibu");
    try {
        // Cek apakah folder 'wibu' ada di dalam 'node_modules'
        await promises_1.default.access(wibuPath);
        return wibuPath;
    }
    catch (error) {
        // Jika folder 'wibu' tidak ditemukan, kembalikan root path aplikasi
        return app_root_path_1.path;
    }
}
class AppUtils {
    static _resolvedAppPath = null;
    // Getter untuk appPath, akan memunculkan warning jika belum diinisialisasi
    static get appPath() {
        if (!this._resolvedAppPath) {
            throw new Error("AppUtils has not been initialized. Please call `AppUtils.init()` first.");
        }
        return this._resolvedAppPath;
    }
    // Metode untuk inisialisasi dan cache root path
    static async init() {
        if (!this._resolvedAppPath) {
            this._resolvedAppPath = await getAppRoot();
        }
        return this._resolvedAppPath;
    }
}
exports.AppUtils = AppUtils;
