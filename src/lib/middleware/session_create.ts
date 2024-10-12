import { cookies } from "next/headers";
import { encrypt } from "./encrypt";

export async function sessionCreate({
  sessionKey,
  exp = "7 year",
  encodedKey,
  user
}: {
  sessionKey: string;
  exp?: string;
  encodedKey: string;
  user: Record<string, unknown>;
}) {
  const token = await encrypt({
    exp,
    encodedKey,
    user
  });

  const cookie: any = {
    key: sessionKey,
    value: token,
    options: {
      httpOnly: true,
      sameSite: "lax",
      path: "/"
    }
  };

  cookies().set(cookie.key, cookie.value, { ...cookie.options });
  return token;
}
