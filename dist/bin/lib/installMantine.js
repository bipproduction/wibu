"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installMantine = installMantine;
const app_root_path_1 = require("app-root-path");
const path_1 = __importDefault(require("path"));
const createDir_1 = require("../util/createDir");
const installModule_1 = require("../util/installModule");
const installSupportPackage_1 = require("../util/installSupportPackage");
const installSupportPackageDev_1 = require("../util/installSupportPackageDev");
async function installMantine() {
    await (0, installSupportPackage_1.installSupportPackage)({
        supportPackages: "@mantine/core @mantine/hooks"
    });
    await (0, installSupportPackageDev_1.installSupportPackageDev)({ supportPackages: "postcss postcss-preset-mantine postcss-simple-vars" });
    await (0, createDir_1.createDir)({ sourceDir: process.cwd() });
    await (0, installModule_1.installModule)({ sourceDir: path_1.default.join(app_root_path_1.path, "assets/mantine") });
}
