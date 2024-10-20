import { PushNotificationDataSend } from "./types/PushNotificationDataSend";
/**
 *
 * @example
 * const sendNotif = await Push.pushNotificationSendFromServer({
    data: data,
    WIBU_PUSH_DB_TOKEN: EnvServer.env.WIBU_PUSH_DB_TOKEN,
    vapidPrivateKey: EnvServer.env.VAPID_PRIVATE_KEY!,
    vapidPublicKey: EnvServer.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
  });
 */
export declare function pushNotificationSendFromServer({ data, vapidPublicKey, vapidPrivateKey, WIBU_PUSH_DB_TOKEN }: {
    data: PushNotificationDataSend;
    vapidPublicKey: string;
    vapidPrivateKey: string;
    WIBU_PUSH_DB_TOKEN: string;
}): Promise<{
    error: string;
    status: number;
    success?: undefined;
    message?: undefined;
    data?: undefined;
} | {
    success: boolean;
    message: string;
    data: any[];
    error?: undefined;
    status?: undefined;
} | {
    success: boolean;
    message: string;
    error: any;
    status?: undefined;
    data?: undefined;
}>;
