/* eslint-disable @typescript-eslint/no-explicit-any */

import webpush from "web-push";

import { PushNotificationDataSend } from "./types/PushNotificationDataSend";
import { PushDb } from "../PushDb";

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
export async function pushNotificationSendFromServer({
  data,
  vapidPublicKey,
  vapidPrivateKey,
  WIBU_PUSH_DB_TOKEN
}: {
  data: PushNotificationDataSend;
  vapidPublicKey: string;
  vapidPrivateKey: string;
  WIBU_PUSH_DB_TOKEN: string;
}) {
  // Set VAPID details
  webpush.setVapidDetails(
    "mailto:bip.production.js@gmail.com",
    vapidPublicKey,
    vapidPrivateKey
  );

  const listDataNotif: any[] = []; // Pindahkan di dalam function
  PushDb.init({
    project: "push-notification",
    WIBU_PUSH_DB_TOKEN
  });
  try {
    // Fetch all subscriptions
    const subscriptions = await PushDb.findMany();

    if (!subscriptions || subscriptions.length === 0) {
      console.error("No subscriptions available to send notification");
      return { error: "No subscriptions found", status: 400 };
    }

    // Process notifications in parallel
    const notificationPromises = subscriptions.map(async (sub) => {
      const notificationPayload = JSON.stringify({
        title: data.title ?? "Test Notification",
        body: data.body ?? "This is a test notification",
        endpoint: data.endpoint,
        link: data.link,
        variant: data.variant,
        createdAt: new Date()
      });

      try {
        const subscriptionData = sub.data as any;
        await webpush.sendNotification(subscriptionData, notificationPayload);

        listDataNotif.push({
          success: true,
          notificationPayload,
          status: "success"
        });
      } catch (error: any) {
        console.error(
          `Error sending push notification to subscription ${sub.id}:`,
          error
        );
        listDataNotif.push({
          success: false,
          notificationPayload,
          status: "failure",
          error: error.message || error
        });
      }
    });

    await Promise.all(notificationPromises);

    return {
      success: true,
      message: "Notifications sent",
      data: listDataNotif
    };
  } catch (error: any) {
    console.error("Error during notification process:", error);
    return {
      success: false,
      message: "Failed to process notifications",
      error: error.message || error
    };
  }
}
