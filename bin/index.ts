#!/usr/bin/env node
import { Command } from "commander";
import { generateEnv } from "./lib/generate_env";
import { genExample } from "./lib/generate_example";
import { generatePrisma } from "./lib/generate_prisma";
import { generateType } from "./lib/generate_type";
import { push } from "./lib/git";
import * as pwa from "./lib/pwa";
import { route } from "./lib/route";
import dedent from "dedent";
import * as lib from "./lib";
import { generateWebpush } from "./lib/generate_webpush";

const program = new Command();

program
  .version("1.0.1") // Ganti dengan versi yang sesuai
  .description("CLI untuk berbagai perintah utilitas wibu");

// Command: pwa-install
program
  .command("pwa-install")
  .description("generate pwa nextjs")
  .action(pwa.install)
  .on("--help", () => {
    console.log(dedent`
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
    console.log(dedent`
      Example:
        $ wibu pwa-uninstall
    `);
  });

// Command: route
program
  .command("gen-route")
  .description("generate route")
  .action(route)
  .on("--help", () => {
    console.log(dedent`
      Example:
        $ wibu gen-route
    `);
  });

// Command: git-push
program
  .command("git-push [branch]")
  .description("git push")
  .action((branch) => {
    push(branch);
  })
  .on("--help", () => {
    console.log(dedent`
      Example:
        $ wibu git-push
    `);
  });

// Command: gen-env
program
  .command("gen-env")
  .description("generate env")
  .action(generateEnv as any)
  .on("--help", () => {
    console.log(dedent`
      Example:
        $ wibu gen-env
    `);
  });

// Command: gen-JSDoc
program
  .command("gen-JSDoc <path>")
  .description("generate JSDoc")
  .action((path) => {
    genExample(path);
  })
  .on("--help", () => {
    console.log(dedent`
      Example:
        $ wibu gen-JSDoc ./data.ts
    `);
  });

// Command: gen-prisma
program
  .command("gen-prisma")
  .description("generate prisma")
  .action(generatePrisma)
  .on("--help", () => {
    console.log(dedent`
      Example:
        $ wibu gen-prisma
    `);
  });

// Command: api validate
program
  .command("gen-validate")
  .description("generate validate")
  .action(lib.generateApiValidate)
  .on("--help", () => {
    console.log(dedent`
      Example:
        $ wibu gen-validate
    `);
  });

// generate web push key
program
  .command("gen-webpush")
  .description("generate web push key")
  .action(generateWebpush)
  .on("--help", () => {
    console.log(dedent`
      Example:
        $ wibu gen-webpush
    `);
  });

// Command: gen-type
program
  .command("gen-type <path> [filename]")
  .description("generate type")
  .action((path, filename) => {
    generateType(path, filename);
  })
  .on("--help", () => {
    const example = dedent`
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
