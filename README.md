### PACKAGE TEMPLATE


### MIDDLEWARE

```ts
import { NextRequest } from "next/server";
import { wibuMiddleware } from "wibu/middleware";

export const middleware = (req: NextRequest) =>
  wibuMiddleware({
    req,
    config: {
      apiPath: "/api",
      exp: "7 yeas",
      loginPath: "/login",
      publicRoutes: ["/login", "/register"],
      publicRoutePatterns: [/^\/api\/files\/\w+/],
      userPath: "/user",
      tokenName: "wibu-token"
    },
    encodedKey: "makuro",
  });
  
// Konfigurasi buat middleware Next.js
export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"]
};
```