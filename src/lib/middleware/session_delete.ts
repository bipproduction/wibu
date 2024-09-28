import { cookies } from "next/headers";

export function sessionDelete({ sessionKey }: { sessionKey: string }) {
  const del = cookies().delete(sessionKey);
  return del;
}
