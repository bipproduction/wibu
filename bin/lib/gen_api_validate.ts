import dedent from "dedent";

const text = dedent`
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

import fs from "fs/promises";
import path from "path";

const rootApi = path.join(process.cwd(), "src/app/api");
export async function generateApiValidate() {
    await fs.mkdir(rootApi+"/validate", { recursive: true });
    await fs.writeFile(path.join(rootApi, "validate/route.ts"), text, "utf8");
    console.log("validate generated", path.join(rootApi, "validate/route.ts"));
}
