"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wibuMiddleware = wibuMiddleware;
const server_1 = require("next/server");
const verify_token_1 = require("./verify_token");
require("colors");
function setCorsHeaders(res) {
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res;
}
function handleCors(req) {
    if (req.method === "OPTIONS") {
        return new server_1.NextResponse(null, {
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
function printLog(log, text, color = "yellow", title) {
    log && console.log(title?.yellow || "==>".yellow, text);
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
async function wibuMiddleware(req, { apiPath = "/api", loginPath = "/login", userPath = "/user", encodedKey, publicRoutes = ["/", "/login", "/register"], sessionKey, validationApiRoute = "/api/validate", log = false }) {
    const { pathname } = req.nextUrl;
    printLog(log, `middleware: ${pathname}`);
    // CORS handling
    const corsResponse = handleCors(req);
    if (corsResponse) {
        printLog(log, "cors response", "green");
        return setCorsHeaders(corsResponse);
    }
    // Skip authentication for public routes
    const isPublicRoute = publicRoutes.some((route) => {
        const pattern = route.replace(/\*/g, ".*");
        return new RegExp(`^${pattern}$`).test(pathname);
    });
    printLog(log, `isPublicRoute: ${isPublicRoute}`);
    if (isPublicRoute) {
        printLog(log, "public route", "green");
        return setCorsHeaders(server_1.NextResponse.next());
    }
    const token = req.cookies.get(sessionKey)?.value ||
        req.headers.get("Authorization")?.split(" ")[1];
    // Token verification
    const user = await (0, verify_token_1.verifyToken)({ token, encodedKey });
    printLog(log, `user: ${JSON.stringify(user)}`);
    if (!user) {
        printLog(log, "unauthorized", "red");
        if (pathname.startsWith(apiPath)) {
            printLog(log, "unauthorized api");
            return setCorsHeaders(unauthorizedResponse());
        }
        printLog(log, "redirect to login path");
        return setCorsHeaders(server_1.NextResponse.redirect(new URL(loginPath, req.url)));
    }
    // Redirect authenticated user away from login page
    if (user && pathname === loginPath) {
        printLog(log, "redirect to user path");
        return setCorsHeaders(server_1.NextResponse.redirect(new URL(userPath, req.url)));
    }
    // Validate user access with external API
    const validationResponse = await fetch(new URL(validationApiRoute, req.url), {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    });
    if (!validationResponse.ok) {
        printLog(log, "unauthorized", "red");
        return setCorsHeaders(unauthorizedResponse());
    }
    printLog(log, "authorized", "green");
    // Proceed with the request
    return setCorsHeaders(server_1.NextResponse.next());
}
function unauthorizedResponse() {
    return new server_1.NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
    });
}
