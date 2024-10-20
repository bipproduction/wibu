import { PushNotificationMessage } from "./types/PushNotificationMessage";
import { PushNotificationDataSend } from "./types/PushNotificationDataSend";
import React from "react";
export declare function usePushNotification(): {
    readonly subscription: import("@hookstate/core").ImmutableObject<PushSubscription> | null;
    readonly message: import("@hookstate/core").ImmutableObject<PushNotificationMessage> | null;
    readonly endpoint: string | null;
};
export declare function sendPushNotificationClient({ data, log }: {
    data: PushNotificationDataSend;
    log?: boolean;
}): Promise<any>;
/**
 * # GUIDE
 * @see https://github.com/bipproduction/wibu/tree/main/GUIDE/push-notification.md
 */
export declare function PushNotificationProvider({ log, vapidPublicKey, pushNotificationSubscribeEndpoint, pushNotificationSendEndpoint, wibuWorker }: {
    log?: boolean;
    vapidPublicKey: string;
    pushNotificationSubscribeEndpoint: string;
    pushNotificationSendEndpoint: string;
    wibuWorker: string;
}): React.JSX.Element;
