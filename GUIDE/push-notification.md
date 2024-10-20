# PUSH NOTIFICATION GUIDE

### PushNotificationProvider

```tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";

import { EnvClientProvider } from "@/lib/client/EnvClient";
import { EnvServer } from "@/lib/server/EnvServer";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
// import { PushNotificationProvider } from "@/lib/push_notification/PushNotificationProvider";
import { apies } from "@/lib/routes";
import { Push } from "wibu";

export const metadata = {
  title: "Wibu Base",
  description: "Base Wibu Project"
};

const env = process.env;
EnvServer.init(env as any);

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body suppressHydrationWarning>
        <EnvClientProvider env={JSON.stringify(env)} />
        <Push.PushNotificationProvider
          log
          pushNotificationSubscribeEndpoint={apies["/api/set-subscribe"]}
          pushNotificationSendEndpoint={apies["/api/send-notification"]}
          vapidPublicKey={EnvServer.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY}
          wibuWorker="/wibu_worker.js"
        />
        <MantineProvider defaultColorScheme="dark">{children}</MantineProvider>
      </body>
    </html>
  );
}
```

### usePushNotification

```tsx
"use client";
import {
  Button,
  Card,
  Divider,
  Group,
  Radio,
  Stack,
  TextInput
} from "@mantine/core";
import { useState } from "react";
import { Push } from "wibu";

export default function Page() {
  const { subscription, message } = Push.usePushNotification();
  if (!subscription) return <Stack>Not found | Not Subscribe</Stack>;
  return (
    <Stack p={"lg"}>
      <pre
        style={{
          lineBreak: "anywhere",
          wordBreak: "break-word",
          textWrap: "wrap"
        }}
      >
        {subscription.endpoint}
      </pre>
      <Divider />
      <SendNotification endpoint={subscription.endpoint} />
      <pre>{JSON.stringify(message || null, null, 2)}</pre>
    </Stack>
  );
}

### sendPushNotificationClient

function SendNotification({ endpoint }: { endpoint: string }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    body: "",
    variant: "data"
  });
  async function onSend() {
    if (!form.title || !form.body || !form.variant)
      return alert("Please fill all the fields");
    setLoading(true);
    await Push.sendPushNotificationClient({
      data: {
        endpoint: endpoint,
        body: form.body,
        title: form.title,
        link: "https://www.google.com",
        variant: form.variant as "data" | "notification"
      }
    }).catch((e) => {
      console.error(e);
    });
    setLoading(false);
  }
  return (
    <Card>
      <Stack>
        <pre>{JSON.stringify(form, null, 2)}</pre>
        <TextInput
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          label="Title"
        />
        <TextInput
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
          label="Body"
        />
        <Radio.Group
          value={form.variant}
          label="Variant"
          description="Select variant"
          p={"md"}
          onChange={(e) => setForm({ ...form, variant: e })}
        >
          <Group>
            <Radio value="data" label="Data" />
            <Radio value="notification" label="Notification" />
          </Group>
        </Radio.Group>
        <Group justify="end">
          <Button loading={loading} onClick={onSend}>
            Send
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}

```

### pushNotificationSubscribeFromServer

```ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EnvServer } from "@/lib/server/EnvServer";
import { Push } from "wibu";

EnvServer.init(process.env as any);
export async function POST(req: Request) {
  const json = await req.json();
  const data: PushSubscription = json.data;
  if (!data || !data.endpoint) {
    console.error("Invalid subscription object");
    return new Response(
      JSON.stringify({ error: "Invalid subscription object" }),
      { status: 400 }
    );
  }

  const create = await Push.pushNotificationSubscribeFromServer({
    endpoint: data.endpoint,
    data: data,
    WIBU_PUSH_DB_TOKEN: EnvServer.env.WIBU_PUSH_DB_TOKEN
  });

  return new Response(JSON.stringify({ data: create, success: true }));
}
```

### pushNotificationSendFromServer

```ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EnvServer } from "@/lib/server/EnvServer";
import { PushNotificationDataSend } from "@/types/PushNotificationDataSend";
import { Push } from "wibu";

EnvServer.init(process.env as any);

export async function POST(req: Request) {
  const json = await req.json();
  const data: PushNotificationDataSend | null = json.data;

  if (!data) {
    return new Response(
      JSON.stringify({ error: "Invalid subscription data" }),
      { status: 400 }
    );
  }

  const sendNotif = await Push.pushNotificationSendFromServer({
    data: data,
    WIBU_PUSH_DB_TOKEN: EnvServer.env.WIBU_PUSH_DB_TOKEN,
    vapidPrivateKey: EnvServer.env.VAPID_PRIVATE_KEY!,
    vapidPublicKey: EnvServer.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
  });

  if (!sendNotif.success)
    return new Response(JSON.stringify({ error: sendNotif.error }), {
      status: 500
    });

  return new Response(JSON.stringify({ data: sendNotif }));
}
```
