import { PushDb } from "../PushDb";

export async function pushNotificationSubscribeFromServer({
  endpoint,
  data,
  WIBU_PUSH_DB_TOKEN
}: {
  endpoint: string;
  data: any;
  WIBU_PUSH_DB_TOKEN: string;
}) {
  PushDb.init({
    project: "push-notification",
    WIBU_PUSH_DB_TOKEN
  });

  try {
    await PushDb.upsert({
      id: endpoint,
      data: data
    });

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
