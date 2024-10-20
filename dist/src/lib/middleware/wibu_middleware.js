"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wibuMiddleware = wibuMiddleware;
const server_1 = require("next/server");
const verify_token_1 = require("./verify_token");
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
function printLog(log, text, title) {
    log && console.log(title || "==>", text);
}
/**
 * # GUIDE
 * @see https://github.com/bipproduction/wibu/tree/main/GUIDE/wibu-midleware.md
 */
async function wibuMiddleware(req, { apiPath = "/api", loginPath = "/login", userPath = "/user", encodedKey, publicRoutes = ["/", "/login", "/register"], sessionKey, validationApiRoute = "/api/validate", log = false }) {
    const { pathname } = req.nextUrl;
    printLog(log, `middleware: ${pathname}`);
    // CORS handling
    const corsResponse = handleCors(req);
    if (corsResponse) {
        printLog(log, "cors response");
        return setCorsHeaders(corsResponse);
    }
    // Skip authentication for public routes
    const isPublicRoute = [
        ...publicRoutes,
        loginPath,
        validationApiRoute
    ].some((route) => {
        const pattern = route.replace(/\*/g, ".*");
        return new RegExp(`^${pattern}$`).test(pathname);
    });
    printLog(log, `isPublicRoute: ${isPublicRoute}`);
    if (isPublicRoute) {
        printLog(log, "public route");
        return setCorsHeaders(server_1.NextResponse.next());
    }
    const token = req.cookies.get(sessionKey)?.value ||
        req.headers.get("Authorization")?.split(" ")[1];
    // Token verification
    const user = await (0, verify_token_1.verifyToken)({ token, encodedKey });
    printLog(log, `user: ${JSON.stringify(user)}`);
    if (!user) {
        printLog(log, "unauthorized");
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
    if (req.nextUrl.pathname.startsWith(apiPath)) {
        const reqToken = req.headers.get("Authorization")?.split(" ")[1];
        // Validate user access with external API
        const validationResponse = await fetch(new URL(validationApiRoute, req.url), {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${reqToken}`
            }
        });
        if (!validationResponse.ok) {
            printLog(log, "unauthorized");
            return setCorsHeaders(unauthorizedResponse());
        }
    }
    printLog(log, "authorized");
    // Proceed with the request
    return setCorsHeaders(server_1.NextResponse.next());
}
function unauthorizedResponse() {
    return new server_1.NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
    });
}
