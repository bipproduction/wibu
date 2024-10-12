```ts
import { NextRequest } from "next/server";
import { wibuMiddleware } from "wibu";
import { EnvServer } from "./lib/server/EnvServer";
import { apies, pages } from "./lib/routes";

EnvServer.init(process.env as any);
export const middleware = (req: NextRequest) =>
  wibuMiddleware(req as any, {
    publicRoutes: ["/", "/login", "/register", "/api/register", "/api/login"],
    encodedKey: EnvServer.env.NEXT_PUBLICWA_SERVER_TOKEN_KEY,
    sessionKey: EnvServer.env.NEXT_PUBLIC_WA_SERVER_SESSION_KEY,
    validationApiRoute: apies["/api/validate"],
    // log: true
  });

export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"]
};

```