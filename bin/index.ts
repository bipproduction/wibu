#!/usr/bin/env node
import { Command } from "commander";
import dedent from "dedent";
import { generateEnv } from "./lib/generate_env";
import { generatePrisma } from "./lib/generate_prisma";
import { generateType } from "./lib/generate_type";
import { innstallPushNotification } from "./lib/installPushNotification";
import { push } from "./lib/git";
import { installMiddleware } from "./lib/installMiddleware";
import { route } from "./lib/route";

const program = new Command();

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

// Command: gen-middleware
program
  .command("install-middleware")
  .description("install middleware")
  .action(installMiddleware as any)
  .on("--help", () => {
    console.log(dedent`
    Example:
      $ wibu install-middleware
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

program
  .command("install-push-notification")
  .description("install push notification")
  .action(innstallPushNotification)
  .on("--help", () => {
    console.log(dedent`
      Example:
        $ wibu install-push-notification
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
