```js
/**
 * @typedef {import('../src/types/PushNotificationDataSend.ts').PushNotificationDataSend} PushNotificationDataSend
 */

const log = false;
function printLog(text) {

    if (log) {
        const stack = new Error().stack;
        const lineInfo = stack.split('\n')[2]; // Ambil baris ke-2 dari stack trace
        const match = lineInfo.match(/(\/.*:\d+:\d+)/); // Regex untuk mengambil file, baris, dan kolom
        const lineNumber = match ? match[1] : 'unknown line';
        console.log(`[${lineNumber}] ==>`, text);
    }
}

self.addEventListener('install', (event) => {
    event.waitUntil(self.skipWaiting());
    // console.log('Service worker installing...');
    printLog('Service worker installing...');
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
    // console.log('Service worker activating...');
    printLog('Service worker activating...');
});

self.addEventListener('push', async function (event) {
    // console.log('Push event received:', JSON.stringify(event.data, null, 2));

    let title = "Default Title";
    let options = {
        body: "Default notification body",
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        image: '/icon-192x192.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: '2',
        },
    };

    if (event.data) {
        try {
            const data = event.data.json();
            title = data.title || title;
            options.body = data.body || options.body;
            options.data = {
                ...options.data,
                ...data,
            };
            printLog(JSON.stringify(options, null, 2));
        } catch (e) {
            console.error("Error parsing push event data:", e);
        }
    } else {
        console.warn("Push event has no data.");
    }

    event.waitUntil(
        (async () => {
            try {
                /**
                 * @type {PushNotificationDataSend}
                 */
                const eventData = options.data;
                // munculkan notifikasi namun hanya ketika tidak ada client yang terdeteksi
                const clientList = await clients.matchAll({ type: 'window', includeUncontrolled: true });
                let isClientFocused = false;

                for (const client of clientList) {

                    client.postMessage({
                        type: 'PUSH_RECEIVED',
                        title: eventData.title,
                        body: eventData.body,
                        variant: eventData.variant,
                        createdAt: eventData.createdAt,
                        acceptedAt: Date.now(),
                    });

                    if (client.focused) {
                        isClientFocused = true;
                        break;
                    }
                }

                // Periksa endpoint jika ada dan sama dengan pengirim tidak akan menampilkan notifikasi
                const myEndpoint = await getEndpointFromIndexedDB();


                if (myEndpoint && eventData.endpoint === myEndpoint) {
                    // console.log("Notification sent to self, skipping display.");
                    printLog("Notification sent to self, skipping display.");
                    return;
                }

                if (eventData.variant === 'data') {
                    printLog('type data, skipping display.');
                    return
                }

                // Only show notification if no clients are focused
                if (!isClientFocused) {
                    await self.registration.showNotification(title, options);
                } else {
                    printLog('Client is focused, no notification shown.');
                }
            } catch (err) {
                console.error("Error showing notification:", err);
            }
        })()
    );
});

self.addEventListener('notificationclick', function (event) {

    const clickedLink = event.notification.data.link;
    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if (client.url.includes(clickedLink) && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(clickedLink);
            }
        }).catch(err => {
            console.error("Error handling notification click:", err);
        })
    );
});

function getEndpointFromIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('pushNotifications', 1);

        request.onsuccess = function () {
            const db = request.result;
            const transaction = db.transaction('endpoints', 'readonly');
            const store = transaction.objectStore('endpoints');
            const getRequest = store.get('myEndpoint');

            getRequest.onsuccess = function () {
                resolve(getRequest.result ? getRequest.result.endpoint : null);
            };

            getRequest.onerror = function () {
                reject('Failed to retrieve endpoint from IndexedDB');
            };
        };

        request.onerror = function () {
            reject('Failed to open IndexedDB');
        };
    });
}

```