"use client";
// take
import { hookstate, useHookstate } from "@hookstate/core";
import { useShallowEffect } from "@mantine/hooks";
import { devLog } from "../devLog";
import { PushNotificationMessage } from "./types/PushNotificationMessage";
import { PushNotificationDataSend } from "./types/PushNotificationDataSend";
import React from "react";
import {
  pushNotificationMessage,
  pushNotificationSubscription
} from "./pushState";

class SendNotificationEndpoint {
  static endpoint: string | null = null;
  static init(url: string) {
    this.endpoint = url;
  }
}

/**
 * # GUIDE
 * @see https://github.com/bipproduction/wibu/tree/main/GUIDE/push-notification.md
 */
export function usePushNotification() {
  const { value: subscription } = useHookstate(pushNotificationSubscription);
  const { value: message } = useHookstate(pushNotificationMessage);
  return {
    subscription,
    message,
    endpoint: SendNotificationEndpoint.endpoint
  } as const;
}

/**
 * # GUIDE
 * @see https://github.com/bipproduction/wibu/tree/main/GUIDE/push-notification.md
 */
export async function sendPushNotificationClient({
  data,
  log = false
}: {
  data: PushNotificationDataSend;
  log?: boolean;
}) {
  const printLog = devLog(log);
  try {
    printLog("Sending push notification");
    if (!SendNotificationEndpoint.endpoint) {
      printLog("Endpoint not initialized");
      return {
        success: false,
        message: "Endpoint not initialized"
      };
    }
    const res = await fetch(SendNotificationEndpoint.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data
      })
    });

    if (!res.ok) {
      printLog("Failed to send push notification");
      return {
        success: false,
        message: "Failed to send notification:"
      };
    }

    printLog("Push notification sent");
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("Notification error:", error);
    return {
      success: false,
      message: "Failed to process notifications",
      error
    };
  }
}

/**
 * # GUIDE
 * @see https://github.com/bipproduction/wibu/tree/main/GUIDE/push-notification.md
 */
export function PushNotificationProvider({
  log = false,
  vapidPublicKey,
  pushNotificationSubscribeEndpoint,
  pushNotificationSendEndpoint,
  wibuWorker
}: {
  log?: boolean;
  vapidPublicKey: string;
  pushNotificationSubscribeEndpoint: string;
  pushNotificationSendEndpoint: string;
  wibuWorker: string;
}) {
  SendNotificationEndpoint.init(pushNotificationSendEndpoint);
  const { set: setSubscription } = useHookstate(pushNotificationSubscription);

  const { set: setMessage } = useHookstate(pushNotificationMessage);

  const printLog = devLog(log);

  const urlB64ToUint8Array = (base64String: string) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  function saveEndpointToIndexedDB(endpoint: string) {
    const request = indexedDB.open("pushNotifications", 1);

    request.onupgradeneeded = function () {
      const db = request.result;
      if (!db.objectStoreNames.contains("endpoints")) {
        printLog("Creating endpoints object store");
        db.createObjectStore("endpoints", { keyPath: "id" });
      }
    };

    request.onsuccess = function () {
      const db = request.result;
      const transaction = db.transaction("endpoints", "readwrite");
      const store = transaction.objectStore("endpoints");
      store.put({ id: "myEndpoint", endpoint: endpoint });
      printLog("Stored endpoint in IndexedDB");
    };

    request.onerror = function () {
      console.error("Failed to store endpoint in IndexedDB:", request.error);
    };
  }

  useShallowEffect(() => {
    const registerServiceWorker = async () => {
      printLog("registering service worker");
      try {
        const registration = await navigator.serviceWorker.register(
          wibuWorker,
          {
            scope: "/",
            updateViaCache: "none"
          }
        );
        if (!registration) {
          printLog("failed to register service worker");
          return;
        }

        let sub = await registration.pushManager.getSubscription();

        if (!sub) {
          printLog("Push notifications not subscribed");
          sub = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlB64ToUint8Array(vapidPublicKey)
          });
          printLog("Push notifications subscribed");
        }

        printLog("Push notifications already subscribed");

        const res = await fetch(pushNotificationSubscribeEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: sub.toJSON() })
        });

        if (res.ok) {
          setSubscription(sub);
          // Simpan ke IndexedDB
          saveEndpointToIndexedDB(sub.endpoint);

          printLog(`successfully subscribed to server ${res.statusText}`);
          return;
        }

        printLog(`failed to subscribe ${res.statusText}`);
      } catch (error) {
        console.error("Service Worker registration failed:", error);
      }
    };

    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.error("Push notifications not supported");
      return;
    }

    // Tangani pesan dari service worker
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data) {
        setMessage(event.data);
      }
    });

    const tm = setTimeout(() => {
      registerServiceWorker();
    }, 100);

    return () => clearTimeout(tm);
  }, []);
  return <></>;
}
