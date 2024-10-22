#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const dedent_1 = __importDefault(require("dedent"));
const generate_env_1 = require("./lib/generate_env");
const generate_prisma_1 = require("./lib/generate_prisma");
const generate_type_1 = require("./lib/generate_type");
const installPushNotification_1 = require("./lib/installPushNotification");
const git_1 = require("./lib/git");
const installMiddleware_1 = require("./lib/installMiddleware");
const route_1 = require("./lib/route");
const program = new commander_1.Command();
program
    .version("1.0.1") // Ganti dengan versi yang sesuai
    .description("CLI untuk berbagai perintah utilitas wibu");
// Command: pwa-install
// program
//   .command("pwa-install")
//   .description("generate pwa nextjs")
//   .action(pwa.install)
//   .on("--help", () => {
//     console.log(dedent`
//       Example:
//         $ wibu pwa-install
//     `);
//   });
// Command: pwa-uninstall
// program
//   .command("pwa-uninstall")
//   .description("generate pwa nextjs")
//   .action(pwa.uninstall)
//   .on("--help", () => {
//     console.log(dedent`
//       Example:
//         $ wibu pwa-uninstall
//     `);
//   });
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
// Command: gen-middleware
program
    .command("install-middleware")
    .description("install middleware")
    .action(installMiddleware_1.installMiddleware)
    .on("--help", () => {
    console.log((0, dedent_1.default) `
    Example:
      $ wibu install-middleware
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
program
    .command("install-push-notification")
    .description("install push notification")
    .action(installPushNotification_1.innstallPushNotification)
    .on("--help", () => {
    console.log((0, dedent_1.default) `
      Example:
        $ wibu install-push-notification
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
