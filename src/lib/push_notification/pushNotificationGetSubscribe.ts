import { PushDb } from "../PushDb";

export async function pushNotificationGetSubscribe() {
  const subscribe = await PushDb.findMany();
  return subscribe;
}
