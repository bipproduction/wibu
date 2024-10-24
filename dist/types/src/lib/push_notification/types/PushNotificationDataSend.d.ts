type Variant = "notification" | "data";
export type PushNotificationDataSend = {
    title: string;
    body: string;
    variant: Variant;
    link?: string;
    endpoint?: string;
    createdAt?: number;
    acceptedAt?: number;
};
export {};
