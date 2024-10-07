import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
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
export declare function wibuMiddleware(req: NextRequest, { apiPath, loginPath, userPath, encodedKey, publicRoutes, publicRoutePatterns, sessionKey, validationApiRoute }: WibuMiddlewareConfig): Promise<NextResponse<unknown>>;
export {};
