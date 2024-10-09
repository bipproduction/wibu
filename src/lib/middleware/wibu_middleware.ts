import { NextRequest } from "next/server";
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
    publicRoutes: ["/login", "/api/*"], // Menambahkan route publik di sini
    sessionKey: EnvServer.env.NEXT_PUBLIC_WA_SERVER_SESSION_KEY,
    userPath: "/user",
    validationApiRoute: "/api/validate"
  });

export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"] // Menyertakan semua route kecuali yang diabaikan
};

 */
export async function wibuMiddleware(
  req: NextRequest,
  {
    apiPath = "/api",
    loginPath = "/login",
    userPath = "/user",
    encodedKey,
    publicRoutes = ["/", "/login", "/register"],
    sessionKey,
    validationApiRoute = "/api/validate"
  }: {
    apiPath?: string;
    loginPath?: string;
    userPath?: string;
    encodedKey: string;
    publicRoutes?: string[];
    sessionKey: string;
    validationApiRoute?: string;
  }
) {
  const { pathname } = req.nextUrl;

  // CORS handling
  const corsResponse = handleCors(req);
  if (corsResponse) {
    return setCorsHeaders(corsResponse);
  }

  // Skip authentication for public routes
  const isPublicRoute = publicRoutes.some((route) => {
    return route.endsWith("/*")
      ? new RegExp(`^${route.slice(0, -2).replace(/\//g, "\\/")}\\w+`).test(
          pathname
        )
      : route === pathname;
  });

  if (isPublicRoute) {
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
  }).catch(() => {
    throw new Error("/api/validate API request failed");
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
