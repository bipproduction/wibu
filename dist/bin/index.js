#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const generate_env_1 = require("./lib/generate_env");
const generate_example_1 = require("./lib/generate_example");
const generate_prisma_1 = require("./lib/generate_prisma");
const generate_type_1 = require("./lib/generate_type");
const git_1 = require("./lib/git");
const pwa = __importStar(require("./lib/pwa"));
const route_1 = require("./lib/route");
const dedent_1 = __importDefault(require("dedent"));
const program = new commander_1.Command();
program
    .version("1.0.0") // Ganti dengan versi yang sesuai
    .description("CLI untuk berbagai perintah utilitas wibu");
// Command: pwa-install
program
    .command("pwa-install")
    .description("generate pwa nextjs")
    .action(pwa.install)
    .on("--help", () => {
    console.log((0, dedent_1.default) `
      Example:
        $ wibu pwa-install
    `);
});
// Command: pwa-uninstall
program
    .command("pwa-uninstall")
    .description("generate pwa nextjs")
    .action(pwa.uninstall)
    .on("--help", () => {
    console.log((0, dedent_1.default) `
      Example:
        $ wibu pwa-uninstall
    `);
});
// Command: route
program
    .command("gen-route")
    .description("generate route")
    .action(route_1.route)
    .on("--help", () => {
    console.log((0, dedent_1.default) `
      Example:
        $ wibu gen-route
    `);
});
// Command: git-push
program
    .command("git-push [branch]")
    .description("git push")
    .action((branch) => {
    (0, git_1.push)(branch);
})
    .on("--help", () => {
    console.log((0, dedent_1.default) `
      Example:
        $ wibu git-push
    `);
});
// Command: gen-env
program
    .command("gen-env")
    .description("generate env")
    .action(generate_env_1.generateEnv)
    .on("--help", () => {
    console.log((0, dedent_1.default) `
      Example:
        $ wibu gen-env
    `);
});
// Command: gen-JSDoc
program
    .command("gen-JSDoc <path>")
    .description("generate JSDoc")
    .action((path) => {
    (0, generate_example_1.genExample)(path);
})
    .on("--help", () => {
    console.log((0, dedent_1.default) `
      Example:
        $ wibu gen-JSDoc ./data.ts
    `);
});
// Command: gen-prisma
program
    .command("gen-prisma")
    .description("generate prisma")
    .action(generate_prisma_1.generatePrisma)
    .on("--help", () => {
    console.log((0, dedent_1.default) `
      Example:
        $ wibu gen-prisma
    `);
});
// Command: gen-type
program
    .command("gen-type <path> [filename]")
    .description("generate type")
    .action((path, filename) => {
    (0, generate_type_1.generateType)(path, filename);
})
    .on("--help", () => {
    const example = (0, dedent_1.default) `
    Example:
      $ wibu gen-type ./data.json
      $ wibu gen-type ./data.json nama_type
      $ wibu gen-type https://example.com/data.json
    `;
    console.log(example);
});
// Menampilkan help jika tidak ada command yang dipilih
program.command("*").action(() => {
    console.error("Please specify a command to run");
    program.help();
});
program.parse(process.argv);
