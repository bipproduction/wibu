"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEnv = generateEnv;
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const loading_cli_1 = __importDefault(require("loading-cli"));
const dotenv_1 = __importDefault(require("dotenv"));
const json_to_ts_1 = __importDefault(require("json-to-ts"));
const dedent_1 = __importDefault(require("dedent"));
const root = process.cwd();
const envServerText = (0, dedent_1.default) `
    import { Envs } from "@/types/Envs";

    export class EnvServer {
      static env: Envs;
      static init(env: Envs) {
        this.env = env;
      }
    }
  `;
const envClientClass = (0, dedent_1.default) `
    "use client";
    import { Envs } from "@/types/Envs";
    export class EnvClient {
      static env: Envs;
      static init(env: Envs) {
        this.env = env;
      }
    }
    export function EnvClientProvider({ env }: { env?: string }) {
      const jsonEnv = env ? JSON.parse(env) : {};

      EnvClient.init(jsonEnv);
      return null;
    }
  `;
// const envProviderText = dedent`
//     import { EnvClientProvider } from "./client/EnvClient";
//     import { EnvServer } from "./server/EnvServer";
//     export function EnvProvider({ env }: { env?:string }) {
//       const jsonEnv = env ? JSON.parse(env) : {};
//       EnvServer.init(jsonEnv);
//       return <EnvClientProvider env={env} />;
//     }
//   `;
async function generateEnv() {
    await promises_1.default.mkdir(path_1.default.join(root, "src/lib/client"), { recursive: true });
    await promises_1.default.mkdir(path_1.default.join(root, "src/lib/server"), { recursive: true });
    const log = (0, loading_cli_1.default)("loading ...").start();
    const env = dotenv_1.default.parse(await promises_1.default.readFile(path_1.default.join(root, ".env"), "utf8"));
    const key = Object.keys(env);
    if (key.length === 0)
        return log.fail("no env");
    const types = (0, json_to_ts_1.default)(env)
        .map((type, i) => `export interface ${type.replace(/interface RootObject/g, "Envs")}`)
        .join("\n");
    await promises_1.default.writeFile(path_1.default.join(root, "src/types/Envs.d.ts"), types, "utf8");
    log.succeed("type env generated");
    await promises_1.default.writeFile(path_1.default.join(root, "src/lib/server/EnvServer.ts"), envServerText, "utf8");
    log.succeed("env server generated");
    // await fs.writeFile(
    //   path.join(root, "src/lib/EnvProvider.tsx"),
    //   envProviderText,
    //   "utf8"
    // );
    // log.succeed("env provider generated");
    await promises_1.default.writeFile(path_1.default.join(root, "src/lib/client/EnvClient.ts"), envClientClass, "utf8");
    log.succeed("env client generated");
    log.succeed("env client generated");
    log.stop();
}
