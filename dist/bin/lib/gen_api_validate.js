"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateApiValidate = generateApiValidate;
const dedent_1 = __importDefault(require("dedent"));
const text = (0, dedent_1.default) `
// generate by wibu
import prisma from "@/lib/prisma";
import { EnvServer } from "@/lib/server/EnvServer";
import { decrypt } from "wibu";

EnvServer.init(process.env as any);
export async function GET(req: Request) {
  return apiValidate({
    req,
    encodedKey: EnvServer.env.NEXT_PUBLICWA_SERVER_TOKEN_KEY
  });
}

async function apiValidate({
  req,
  encodedKey
}: {
  req: Request;
  encodedKey: string;
}) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) {
    return new Response(JSON.stringify({ error: "Missing token" }), {
      status: 401
    });
  }
  const dec = await decrypt({
    token,
    encodedKey
  });

  if (!dec) {
    return new Response(JSON.stringify({ error: "Invalid token" }), {
      status: 401
    });
  }
  const user = await prisma.user.findUnique({
    where: {
      id: dec.id
    }
  });

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 500
    });
  }

  return new Response("ok");
}

`;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const rootApi = path_1.default.join(process.cwd(), "src/app/api");
async function generateApiValidate() {
    await promises_1.default.mkdir(rootApi + "/validate", { recursive: true });
    await promises_1.default.writeFile(path_1.default.join(rootApi, "validate/route.ts"), text, "utf8");
    console.log("validate generated", path_1.default.join(rootApi, "validate/route.ts"));
}
