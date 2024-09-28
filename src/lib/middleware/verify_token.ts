import { decrypt } from "./decrypt";

export async function verifyToken({
    token,
    encodedKey
  }: {
    token: string | undefined;
    encodedKey: string;
  }): Promise<Record<string, unknown> | null> {
    if (!token) return null;
   
    return await decrypt({ token, encodedKey });
  }