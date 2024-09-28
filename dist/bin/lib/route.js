"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.route = route;
const child_process_1 = require("child_process");
const promises_1 = __importDefault(require("fs/promises"));
const lodash_1 = __importDefault(require("lodash"));
const path_1 = __importDefault(require("path"));
const readdirp_1 = __importDefault(require("readdirp"));
const util_1 = __importDefault(require("util"));
const execPromise = util_1.default.promisify(child_process_1.exec);
async function route() {
    await promises_1.default.mkdir(path_1.default.join(process.cwd(), "src/lib"), { recursive: true });
    const pages = [];
    const apies = [];
    for await (const entry of (0, readdirp_1.default)("src/app", {
        fileFilter: (entry) => {
            return entry.basename === "route.ts" || entry.basename === "page.tsx";
        }
    })) {
        const extract = await extractTextWithinBrackets(entry);
        if (entry.basename === "page.tsx") {
            pages.push(extract);
        }
        else {
            apies.push(extract);
        }
    }
    const exportText = `
  export const pages = {
    ${pages.join(",\n")}
  }

  export const apies = {
    ${apies.join(",\n")}
  }
  `;
    const targetPath = path_1.default.join(process.cwd(), "src/lib/routes.ts");
    await promises_1.default.writeFile(targetPath, exportText);
    const { stdout } = await execPromise(`npx prettier ${targetPath} --write`);
    console.log("Success");
}
async function extractTextWithinBrackets(entry) {
    const textFile = await promises_1.default.readFile(entry.fullPath, "utf8");
    const listMethod = ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"];
    const regexMethod = new RegExp(`(${listMethod.join("|")})`, "g");
    const matchMethod = textFile.match(regexMethod);
    const method = matchMethod ? matchMethod[0].trim() : "";
    const str = "/" + lodash_1.default.trim(path_1.default.dirname(entry.path), ".");
    const regex = /\[([^\]]+)\]/g;
    const matches = str.match(regex) || [];
    const param = lodash_1.default.map(matches, (match) => {
        const replace = lodash_1.default.trim(match, "[]");
        // Tangani jika menemukan [...slug]
        if (replace.startsWith("...")) {
            return `${replace.substring(3)}`; // Contoh: "path" untuk [...path]
        }
        return `${replace}`;
    });
    const parameters = lodash_1.default.map(matches, (match) => {
        const replace = lodash_1.default.trim(match, "[]");
        // Tangani jika menemukan [...slug]
        if (replace.startsWith("...")) {
            return `${replace.substring(3)}: string[]`; // Contoh: "path: string[]"
        }
        return `${replace}: string`;
    });
    const pathResult = lodash_1.default.reduce(matches, (result, match) => {
        const replace = lodash_1.default.trim(match, "[]");
        // Tangani jika menemukan [...slug]
        if (replace.startsWith("...")) {
            return lodash_1.default.replace(result, match, `\${${replace.substring(3)}.join("/")}`);
        }
        return lodash_1.default.replace(result, match, `\${${replace}}`);
    }, str);
    const typeEmpty = `"${str}": "${pathResult}"`;
    const typeSlug = `"${str}": ({${param.join(", ")}}:{${parameters.join(", ")}}) => \`${pathResult}\``;
    return lodash_1.default.isEmpty(parameters) ? typeEmpty : typeSlug;
}
