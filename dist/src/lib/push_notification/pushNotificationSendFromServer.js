"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushNotificationSendFromServer = pushNotificationSendFromServer;
const web_push_1 = __importDefault(require("web-push"));
const PushDb_1 = require("../PushDb");
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
async function pushNotificationSendFromServer({ data, vapidPublicKey, vapidPrivateKey, WIBU_PUSH_DB_TOKEN }) {
    // Set VAPID details
    web_push_1.default.setVapidDetails("mailto:bip.production.js@gmail.com", vapidPublicKey, vapidPrivateKey);
    const listDataNotif = []; // Pindahkan di dalam function
    PushDb_1.PushDb.init({
        project: "push-notification",
        WIBU_PUSH_DB_TOKEN
    });
    try {
        // Fetch all subscriptions
        const subscriptions = await PushDb_1.PushDb.findMany();
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
                const subscriptionData = sub.data;
                await web_push_1.default.sendNotification(subscriptionData, notificationPayload);
                listDataNotif.push({
                    success: true,
                    notificationPayload,
                    status: "success"
                });
            }
            catch (error) {
                console.error(`Error sending push notification to subscription ${sub.id}:`, error);
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
    }
    catch (error) {
        console.error("Error during notification process:", error);
        return {
            success: false,
            message: "Failed to process notifications",
            error: error.message || error
        };
    }
}
