import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { jwtVerify, SignJWT } from "jose";

async function decrypt({
  token,
  encodedKey
}: {
  /**
   * Token JWT yang akan didekripsi.
   * @type {string}
   */
  token: string;
  /**
   * Kunci rahasia untuk mendekripsi token JWT.
   * @type {Uint8Array}
   */
  encodedKey: Uint8Array;
}): Promise<Record<string, unknown> | null> {
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"]
    });
    return (payload.user as Record<string, unknown>) || null;
  } catch (error) {
    console.error("Gagal verifikasi session", error);
    return null;
  }
}


export async function encrypt({
  user,
  exp,
  encodedKey
}: {
  /**
   * Data pengguna yang akan dienkripsi dalam token JWT.
   * @type {Record<string, unknown>}
   */
  user: Record<string, unknown>;
  /**
   * Waktu kedaluwarsa token JWT dalam format ISO 8601.
   * @type {string}
   * @example "2024-01-01T00:00:00.000Z"
   */
  exp: string;
  /**
   * Kunci rahasia untuk mengenkripsi token JWT.
   * @type {Uint8Array}
   */
  encodedKey: Uint8Array;
}): Promise<string> {
  return new SignJWT({ user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(encodedKey);
}


async function verifyToken({
  token,
  encodedKey
}: {
  /**
   * Token JWT yang akan diverifikasi.
   * @type {string | undefined}
   */
  token: string | undefined;
  /**
   * Kunci rahasia untuk memverifikasi token JWT.
   * @type {Uint8Array}
   */
  encodedKey: Uint8Array;
}): Promise<Record<string, unknown> | null> {
  if (!token) return null;
  return await decrypt({ token, encodedKey });
}

function setCorsHeaders(res: NextResponse): void {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
}

function handleCors(req: NextRequest, res: NextResponse): NextResponse {
  setCorsHeaders(res);
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
  return res;
}

type WibuMiddlewareConfig = {
  publicRoute: string[];
  publicRoutePatterns: RegExp[];
  signinPath: string;
  userPath: string;
  apiRoute: string;
  tokenKey: string;
  exp: string;
};

/**
 * Middleware untuk autentikasi dan otorisasi pengguna.
 * 
 * @param param0 
 * @returns 
 * 
 * @example
 * ```typescript
 * import { wibuMiddleware } from "@/lib/middleware";
 * import { NextRequest } from "next/server";
 * import { NextResponse } from "next/server";
 * 
 * export const config = {
 *   matcher: ["/((?!_next|static|favicon.ico).*)"]
 * };
 * 
 * export default async function handler(req: NextRequest) {
 *   const config = {
 *     publicRoute: ["/"],
 *     publicRoutePatterns: [],
 *     signinPath: "/login",
 *     userPath: "/profile",
 *     apiRoute: "/api",
 *     tokenKey: "token",
 *     exp: "2024-01-01T00:00:00.000Z"
 *   };
 *   
 *   const encodedKey = new TextEncoder().encode("your_secret_key");
 * 
 *   const res = await wibuMiddleware({ req, config, encodedKey });
 * 
 *   return res;
 * }
 * ```
 */
export async function wibuMiddleware({
  req,
  config,
  encodedKey
}: {
  /**
   * Permintaan HTTP.
   * @type {NextRequest}
   */
  req: NextRequest;
  /**
   * Konfigurasi middleware.
   * @type {WibuMiddlewareConfig}
   */
  config: WibuMiddlewareConfig;
  /**
   * Kunci rahasia untuk mengenkripsi dan mendekripsi token JWT.
   * @type {Uint8Array}
   */
  encodedKey: Uint8Array;
}) {
  const { pathname } = req.nextUrl;

  if (
    config.publicRoute.includes(pathname) ||
    config.publicRoutePatterns.some((pattern) => pattern.test(pathname))
  ) {
    return handleCors(req, NextResponse.next());
  }

  const token =
    req.cookies.get(config.tokenKey)?.value ||
    req.headers.get("Authorization")?.split(" ")[1];
  const user = await verifyToken({ token, encodedKey });

  if (!user) {
    if (pathname.startsWith(config.apiRoute)) {
      return handleCors(req, unauthorizedResponse());
    }
    return handleCors(
      req,
      NextResponse.redirect(new URL(config.signinPath, req.url))
    );
  }

  if (pathname === config.signinPath) {
    return handleCors(
      req,
      NextResponse.redirect(new URL(config.userPath, req.url))
    );
  }

  return handleCors(req, NextResponse.next());
}

function unauthorizedResponse(): NextResponse {
  return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" }
  });
}

export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"]
};
  
  
