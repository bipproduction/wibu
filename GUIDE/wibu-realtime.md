### 1. Installation

First, install the `bipproduction/wibu` package:

```bash
yarn add bipproduction/wibu
```

### 2. Example Usage on Client Side

On the client side, you'll use `WibuRealtime` to handle real-time updates. You can listen for incoming data with `onData` and send data with `setData`.

#### Client-side Example (`pages/index.tsx`):

```tsx
import { useEffect, useState } from "react";
import { WibuRealtime } from "bipproduction/wibu";

const IndexPage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Initialize the realtime connection
    WibuRealtime.init({
      WIBU_REALTIME_TOKEN: process.env.NEXT_PUBLIC_WIBU_REALTIME_TOKEN!,
      project: "sdm",
      onData: (incomingData) => {
        setData(incomingData); // Update state with the new data
      },
    });

    return () => {
      WibuRealtime.cleanup(); // Clean up on unmount
    };
  }, []);

  const sendData = async () => {
    const newData = { name: "John Doe", age: 30 };
    const result = await WibuRealtime.setData(newData);
    if (result) {
      console.log("Data sent successfully:", result);
    }
  };

  return (
    <div>
      <h1>Realtime Data: {JSON.stringify(data)}</h1>
      <button onClick={sendData}>Send Data</button>
    </div>
  );
};

export default IndexPage;
```

### 3. Example Usage on Server Side

On the server side, you can also listen for data updates and send data when necessary.

#### Server-side Example (`pages/api/realtime.ts`):

```ts
import { NextApiRequest, NextApiResponse } from "next";
import { WibuRealtime } from "bipproduction/wibu";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { data } = req.body;

    // Send data to WibuRealtime
    const result = await WibuRealtime.setData(data);

    if (result) {
      return res.status(200).json({ message: "Data sent successfully", result });
    } else {
      return res.status(500).json({ message: "Error sending data" });
    }
  }

  if (req.method === "GET") {
    // Initialize WibuRealtime for receiving data
    WibuRealtime.init({
      WIBU_REALTIME_TOKEN: process.env.WIBU_REALTIME_TOKEN!,
      project: "sdm",
      onData: (incomingData) => {
        console.log("New data received:", incomingData);
      },
    });

    return res.status(200).json({ message: "Listening for data updates..." });
  }

  res.setHeader("Allow", ["POST", "GET"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
```

### Key Methods

1. **`init({ WIBU_REALTIME_TOKEN, project, onData })`**:
   - Initializes the real-time connection and listens for updates based on the project provided.
   - Example projects: `"sdm"`, `"hipmi"`, `"test"`.
   - The `onData` callback is triggered whenever new data is received.

2. **`setData(data)`**:
   - Sends or updates data in the real-time database.
   - This method is used for data submission or updates.

3. **`cleanup()`**:
   - Cleans up the channel and connection when no longer needed.

### Environment Variables

Ensure that you have a `.env` file with the following variable:

```bash
NEXT_PUBLIC_WIBU_REALTIME_TOKEN=your_wibu_realtime_token_here
```

### Conclusion

By using `WibuRealtime`, you can seamlessly replace Supabase with the new real-time solution. This setup ensures real-time updates on both client and server sides.