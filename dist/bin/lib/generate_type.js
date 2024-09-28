"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateType = generateType;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const url_1 = require("url");
const json_to_ts_1 = __importDefault(require("json-to-ts"));
const lodash_1 = __importDefault(require("lodash"));
const loading_cli_1 = __importDefault(require("loading-cli"));
const rootTypes = path_1.default.join(process.cwd(), "src/types");
async function generateType(pathSource, fileName) {
    const log = (0, loading_cli_1.default)("loading ...").start();
    try {
        await promises_1.default.mkdir(rootTypes, { recursive: true });
        const dataJson = isValidUrl(pathSource)
            ? await fetchJsonFromUrl(pathSource)
            : await fetchJsonFromFile(pathSource);
        if (!dataJson)
            return log.fail("Failed to generate type | dataJson");
        let { name, json } = dataJson;
        if (fileName) {
            name = fileName;
        }
        name = lodash_1.default.startCase(name).replace(/ /g, "");
        const jsonObject = Array.isArray(json) ? json[0] : json;
        log.info("Generating type ...");
        const types = (0, json_to_ts_1.default)(jsonObject)
            .map((type, i) => i === 0
            ? `export interface ${type.replace(/interface RootObject/g, name)}`
            : type)
            .join("\n");
        await promises_1.default.writeFile(path_1.default.join(rootTypes, `${name}.d.ts`), `/* eslint-disable @typescript-eslint/no-explicit-any */\n${types}`, "utf8");
        log.succeed("Type generated");
    }
    catch (error) {
        log.fail("Failed to generate type | global error");
        console.error(error);
    }
    finally {
        log.stop();
    }
}
function isValidUrl(url) {
    try {
        new url_1.URL(url);
        return true;
    }
    catch {
        return false;
    }
}
async function fetchJsonFromUrl(url) {
    const response = await fetch(url);
    if (!response.ok) {
        console.log("File not found" + response.statusText);
        return null;
    }
    const json = await response.json();
    return { name: path_1.default.basename(url), json };
}
async function fetchJsonFromFile(filePath) {
    if (path_1.default.extname(filePath) !== ".json") {
        console.log("Only .json is supported");
        return null;
    }
    const json = JSON.parse(await promises_1.default.readFile(filePath, "utf8"));
    return { name: path_1.default.basename(filePath, ".json"), json };
}
