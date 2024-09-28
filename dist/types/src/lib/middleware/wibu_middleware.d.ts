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
};
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
export declare function wibuMiddleware(req: NextRequest | any, config: WibuMiddlewareConfig): Promise<NextResponse<unknown>>;
export {};
