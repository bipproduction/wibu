import { SignJWT } from "jose";

export async function encrypt({
  user,
  exp = "7 year",
  encodedKey
}: {
  user: Record<string, any>;
  exp?: string;
  encodedKey: string;
}): Promise<string | null> {
  try {
    const enc = new TextEncoder().encode(encodedKey);
    return new SignJWT({ user })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(exp)
      .sign(enc);
  } catch (error) {
    console.error("Gagal mengenkripsi", error);
    return null;
  }
}
