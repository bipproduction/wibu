export type PushNotificationSubscribe = {
    endpoint: string;
    expirationTime: number;
    keys: {
      p256dh: string;
      auth: string;
    };
  };
  