import { hookstate } from "@hookstate/core";
import { PushNotificationMessage } from "./types/PushNotificationMessage";

export const pushNotificationMessage =
  hookstate<PushNotificationMessage | null>(null);
export const pushNotificationSubscription = hookstate<PushSubscription | null>(
  null
);