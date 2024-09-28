// Import type NextRequest buat nanganin request, dan NextResponse buat balikin response.
// Juga import jwtVerify dan SignJWT dari "jose" buat verifikasi dan bikin JWT.
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { jwtVerify, SignJWT } from "jose";

// Kunci rahasia buat konfigurasi
const secretKey = process.env.SESSION_SECRET || ""; // Kalo SESSION_SECRET nggak ada, pake string kosong biar gak error
const encodedKey = new TextEncoder().encode(secretKey); // Kunci ini bakal diencode buat dipake di JWT

// Konfigurasi middleware
const middlewareConfig = {
  publicRoute: [
    // Daftar route yang bisa diakses tanpa login
    "/",
    "/auth/login",
    "/auth/register",
    "/api/signin",
    "/api/register"
  ],
  publicPatterns: [/^\/api\/files\/\w+/], // Regex buat nge-match route API yang bisa diakses bebas
  signinPath: "/auth/login", // Brute buat halaman login
  userPath: "/user", // Route buat halaman user setelah login
  apiRoute: "/api",
  tokenKey: "ws_token",
  exp: "7 year"
};

// Fungsi buat decode token JWT
async function decrypt(token: string): Promise<Record<string, unknown> | null> {
  try {
    // Cek token JWT pake algoritma HS256 dan kunci terenkripsi
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"]
    });
    // Balikin data 'user' dari payload atau null kalo nggak ada
    return (payload.user as Record<string, unknown>) || null;
  } catch (error) {
    console.error("Gagal verifikasi session", error); // Kalo error, log error-nya
    return null; // Balikin null kalo verifikasi gagal
  }
}

// Fungsi buat bikin (encode) token JWT
export async function encrypt(
  user: Record<string, unknown>, // Data user yang mau dimasukkan ke token
  exp = middlewareConfig.exp // Waktu expired token, default 7 tahun
): Promise<string> {
  return new SignJWT({ user }) // Bikin token baru dengan data user
    .setProtectedHeader({ alg: "HS256" }) // Set header buat algoritma HS256
    .setIssuedAt() // Waktu token dibuat
    .setExpirationTime(exp) // Waktu expired token
    .sign(encodedKey); // Sign token pake kunci terenkripsi
}

// Fungsi buat verifikasi token dan balikin data user
async function verifyToken(
  token: string | undefined
): Promise<Record<string, unknown> | null> {
  if (!token) return null; // Kalo nggak ada token, balikin null
  return await decrypt(token); // Kalo ada, decrypt token dan ambil datanya
}

// Fungsi buat set header CORS
function setCorsHeaders(res: NextResponse): void {
  res.headers.set("Access-Control-Allow-Origin", "*"); // Semua origin diizinkan buat akses
  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  ); // Metode HTTP yang diizinkan
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  ); // Header yang diizinkan
}

// Fungsi buat nanganin setup CORS dan preflight request (OPTIONS)
function handleCors(req: NextRequest, res: NextResponse): NextResponse {
  setCorsHeaders(res); // Set header CORS

  // Kalo request-nya OPTIONS (preflight)
  if (req.method === "OPTIONS") {
    // Balikin response tanpa konten dengan status 204
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*", // Semua origin diizinkan
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS", // Metode HTTP yang diizinkan
        "Access-Control-Allow-Headers": "Content-Type, Authorization", // Header yang diizinkan
        "Access-Control-Max-Age": "86400" // Cache preflight response selama 1 hari
      }
    });
  }

  return res; // Kalo bukan OPTIONS, balikin response biasa
}

// Fungsi utama middleware
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl; // Ambil path dari URL request

  // Ngecek apakah route termasuk route publik
  if (
    middlewareConfig.publicRoute.includes(pathname) || // Kalo route-nya ada di daftar route publik
    middlewareConfig.publicPatterns.some((pattern) => pattern.test(pathname)) // Atau cocok sama pola publik
  ) {
    return handleCors(req, NextResponse.next()); // Lanjutkan ke route berikutnya tanpa cek token
  }

  // Ngecek token di cookies atau header Authorization
  const token =
    req.cookies.get(middlewareConfig.tokenKey)?.value || // Coba dapetin token dari cookie
    req.headers.get("Authorization")?.split(" ")[1]; // Kalo nggak ada, cek di header Authorization
  const user = await verifyToken(token); // Verifikasi token

  if (!user) {
    // Kalo user nggak valid (token nggak ada atau nggak sah)
    if (pathname.startsWith(middlewareConfig.apiRoute)) {
      // Kalo rutenya API
      return handleCors(req, unauthorizedResponse()); // Balikin response "Unauthorized"
    }
    return handleCors(
      req,
      NextResponse.redirect(new URL(middlewareConfig.signinPath, req.url)) // Alihkan ke halaman login
    );
  }

  // Kalo user udah login dan coba akses halaman login lagi, alihkan ke halaman user
  if (pathname === middlewareConfig.signinPath) {
    return handleCors(
      req,
      NextResponse.redirect(new URL(middlewareConfig.userPath, req.url)) // Alihkan ke halaman user
    );
  }

  // User terautentikasi, lanjut ke route berikutnya
  return handleCors(req, NextResponse.next());
}

// Fungsi buat balikin response unauthorized (gak ada hak akses) untuk request API
function unauthorizedResponse(): NextResponse {
  return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
    // Balikin JSON berisi error
    status: 401, // Status Unauthorized
    headers: { "Content-Type": "application/json" } // Set header type konten ke JSON
  });
}

// Konfigurasi buat middleware Next.js
export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"] // Cocokin semua route kecuali yang dimulai dengan _next, static, atau favicon.ico
};
