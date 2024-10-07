import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyToken } from "./verify_token";

function setCorsHeaders(res: NextResponse): NextResponse {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  return res;
}

function handleCors(req: NextRequest): NextResponse | null {
  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400"
      }
    });
  }
  return null;
}

type WibuMiddlewareConfig = {
  publicRoutes: string[];
  publicRoutePatterns: RegExp[];
  loginPath: string;
  userPath: string;
  apiPath: string;
  sessionKey: string;
  encodedKey: string;
  validationApiRoute: string;
};

/**
 * Wibu middleware for Next.js.
 * @example
 * const config = {
 *   publicRoutes: ['/auth/login', '/auth/register'],
 *   publicRoutePatterns: [/^\/api\/files\/\w+/],
 *   loginPath: '/auth/login',
 *   userPath: '/user',
 *   apiPath: '/api',
 *   sessionKey: 'wibu_session',
 *   encodedKey: 'your_encoded_key',
 *   validationApiRoute: '/api/validate'
 * };
 *
 * // Konfigurasi buat middleware Next.js
 * export const config = {
 *   matcher: ["/((?!_next|static|favicon.ico).*)"]
 * };
 */
export async function wibuMiddleware(
  req: NextRequest,
  {
    apiPath,
    loginPath,
    userPath,
    encodedKey,
    publicRoutes,
    publicRoutePatterns,
    sessionKey,
    validationApiRoute
  }: WibuMiddlewareConfig
) {
  const { pathname } = req.nextUrl;

  // CORS handling
  const corsResponse = handleCors(req);
  if (corsResponse) {
    return setCorsHeaders(corsResponse);
  }

  // Skip authentication for public routes
  if (
    publicRoutes.includes(pathname) ||
    publicRoutePatterns.some((pattern) => pattern.test(pathname))
  ) {
    return setCorsHeaders(NextResponse.next());
  }

  const token =
    req.cookies.get(sessionKey)?.value ||
    req.headers.get("Authorization")?.split(" ")[1];

  // Token verification
  const user = await verifyToken({ token, encodedKey });
  if (!user) {
    if (pathname.startsWith(apiPath)) {
      return setCorsHeaders(unauthorizedResponse());
    }
    return setCorsHeaders(NextResponse.redirect(new URL(loginPath, req.url)));
  }

  // Redirect authenticated user away from login page
  if (pathname === loginPath) {
    return setCorsHeaders(NextResponse.redirect(new URL(userPath, req.url)));
  }

  // Validate user access with external API
  const validationResponse = await fetch(new URL(validationApiRoute, req.url), {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });

  if (!validationResponse.ok) {
    return setCorsHeaders(unauthorizedResponse());
  }

  // Proceed with the request
  return setCorsHeaders(NextResponse.next());
}

function unauthorizedResponse(): NextResponse {
  return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" }
  });
}
