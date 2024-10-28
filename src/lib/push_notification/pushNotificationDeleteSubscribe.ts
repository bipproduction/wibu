import { PushDb } from "../PushDb";

export async function pushNotificationDeleteSubscribe(endpoint: string) {
  const subscribe = await PushDb.delete(endpoint);
  return subscribe;
}
