import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
/**
 * @example
import { NextRequest } from "next/server";
import { wibuMiddleware } from "wibu"; // Pastikan ini mengarah ke file yang benar
import { EnvServer } from "./lib/server/EnvServer";

// Inisialisasi environment
EnvServer.init(process.env as any);

export const middleware = async (req: NextRequest) =>
  await wibuMiddleware(req, {
    apiPath: "/api",
    encodedKey: EnvServer.env.NEXT_PUBLICWA_SERVER_TOKEN_KEY,
    loginPath: "/login",
    publicRoutes: ["/login", "/api/*"], // Menambahkan rute publik di sini
    sessionKey: EnvServer.env.NEXT_PUBLIC_WA_SERVER_SESSION_KEY,
    userPath: "/user",
    validationApiRoute: "/api/validate"
  });

export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"] // Menyertakan semua rute kecuali yang diabaikan
};

 */
export declare function wibuMiddleware(req: NextRequest, { apiPath, loginPath, userPath, encodedKey, publicRoutes, sessionKey, validationApiRoute }: {
    apiPath?: string;
    loginPath?: string;
    userPath?: string;
    encodedKey: string;
    publicRoutes: string[];
    sessionKey: string;
    validationApiRoute?: string;
}): Promise<NextResponse<unknown>>;
