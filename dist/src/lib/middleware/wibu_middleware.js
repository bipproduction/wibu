"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wibuMiddleware = wibuMiddleware;
const server_1 = require("next/server");
const verify_token_1 = require("./verify_token");
function setCorsHeaders(res) {
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
}
function handleCors(req, res) {
    setCorsHeaders(res);
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
    return res;
}
/**
 * Middleware untuk melakukan otentikasi dan menangani CORS pada permintaan.
 *
 * @param {Object} param - Parameter fungsi.
 * @param {NextRequest} param.req - Objek permintaan dari Next.js.
 * @param {WibuMiddlewareConfig} param.config - Konfigurasi middleware yang berisi informasi routing dan pengaturan lainnya.
 * Contoh:
 * ```js
 * {
 *   publicRoute: ['/auth/login', '/auth/register'], // Route yang bisa diakses tanpa otentikasi
 *   publicRoutePatterns: [/^\/api\/files\/\w+/], // Pola regex untuk route umum
 *   signinPath: '/auth/login', // Route untuk halaman login
 *   userPath: '/user', // Rute untuk halaman pengguna setelah login
 *   apiPath: '/api', // Rute dasar untuk API
 *   tokenName: 'ws_token', // Nama token yang akan dicari di cookie
 *   exp: '1h' // Waktu kedaluwarsa token
 * }
 * ```
 * @param {Uint8Array} param.encodedKey - Kunci yang digunakan untuk verifikasi token di JWT, dalam format Uint8Array.
 * @returns {Promise<NextResponse>} - Mengembalikan objek NextResponse berdasarkan status otentikasi pengguna.
 *
 * @example
 * // Contoh penggunaan dalam proyek Next.js:
 *
 * import { wibuMiddleware } from './path/to/your/file';
 * import { NextRequest } from 'next/server';
 *
 * // Membuat objek request untuk pengujian
 * const request = new NextRequest('http://localhost/api/private', {
 *   method: 'GET',
 *   headers: { Authorization: 'Bearer your-jwt-token' } // Sertakan token JWT di header Authorization
 * });
 *
 * // Konfigurasi middleware yang akan digunakan
 * const config = {
 *   publicRoute: ['/auth/login', '/auth/register'], // Rute yang dapat diakses tanpa otentikasi
 *   publicRoutePatterns: [/^\/api\/files\/\w+/], // Pola regex untuk mengenali rute umum
 *   signinPath: '/auth/login', // Rute untuk halaman login
 *   userPath: '/user', // Rute untuk halaman pengguna setelah login
 *   apiPath: '/api', // Rute dasar untuk API
 *   tokenName: 'ws_token', // Nama token yang akan dicari dari cookie
 *   exp: '1h' // Waktu kedaluwarsa token
 * };
 *
 * // Kunci yang digunakan untuk verifikasi JWT
 * const secretKey = new TextEncoder().encode('your-secret-key'); // Mengonversi kunci rahasia menjadi Uint8Array
 *
 * // Memanggil middleware dan menunggu responsnya
 * const response = await wibuMiddleware({ req: request, config, encodedKey: secretKey });
 *
 * // Menampilkan hasil respons dari middleware, bisa berisi data yang diinginkan atau status otorisasi
 * console.log(response);
 */
async function wibuMiddleware(req, config) {
    const { pathname } = req.nextUrl;
    if (config.publicRoutes.includes(pathname) ||
        config.publicRoutePatterns.some((pattern) => pattern.test(pathname))) {
        return handleCors(req, server_1.NextResponse.next());
    }
    const token = req.cookies.get(config.sessionKey)?.value ||
        req.headers.get("Authorization")?.split(" ")[1];
    const user = await (0, verify_token_1.verifyToken)({ token, encodedKey: config.encodedKey });
    if (!user) {
        if (pathname.startsWith(config.apiPath)) {
            return handleCors(req, unauthorizedResponse());
        }
        return handleCors(req, server_1.NextResponse.redirect(new URL(config.loginPath, req.url)));
    }
    if (pathname === config.loginPath) {
        return handleCors(req, server_1.NextResponse.redirect(new URL(config.userPath, req.url)));
    }
    return handleCors(req, server_1.NextResponse.next());
}
function unauthorizedResponse() {
    return new server_1.NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
    });
}
