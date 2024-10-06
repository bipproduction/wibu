

## Installation

Install the WibuRealtime package using Yarn:

```bash
yarn add bipproduction/wibu
```

## How to Use WibuRealtime

WibuRealtime allows you to easily subscribe to real-time data changes and perform upserts to the database. Follow the steps below to use it in your project.

### Step 1: Initialize Realtime Client

First, initialize the WibuRealtime client by providing the required token, project name, and optional API URL.

```ts
import { useWibuRealtime } from 'wibu';

const WIBU_REALTIME_TOKEN = process.env.NEXT_PUBLIC_WIBU_REALTIME_TOKEN;
const project = 'sdm'; // or 'hipmi' or 'test'

// Initialize the real-time client
const [currentData, upsertData] = useWibuRealtime({
  WIBU_REALTIME_TOKEN,
  project,
});
```

### Step 2: Subscribe to Real-Time Data Changes

You can now subscribe to real-time data changes in your database. The `currentData` state will be updated automatically whenever there is a change.

```ts
useEffect(() => {
  if (currentData) {
    console.log("Real-time data received:", currentData);
  }
}, [currentData]);
```

### Step 3: Perform Data Upsert

To insert or update data in your project, you can use the `upsertData` function. Pass the data object that you want to upsert.

```ts
const newData = {
  name: "John Doe",
  age: 30,
};

const handleSubmit = async () => {
  const response = await upsertData(newData);

  if (response) {
    console.log("Data upserted successfully:", response);
  } else {
    console.error("Failed to upsert data.");
  }
};
```

### Step 4: Clean Up

To ensure there are no memory leaks, you should clean up the real-time subscription when it's no longer needed, especially in component unmounts.

```ts
useEffect(() => {
  return () => {
    // Cleanup real-time connection
    if (supabaseRef.current && channelRef.current) {
      supabaseRef.current.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  };
}, []);
```

### Full Example

```ts
import React, { useEffect } from "react";
import { useWibuRealtime } from 'wibu';

const WIBU_REALTIME_TOKEN = '<your-token>';
const project = 'sdm'; // or 'hipmi' or 'test'

export default function RealtimeComponent() {
  const [currentData, upsertData] = useWibuRealtime({
    WIBU_REALTIME_TOKEN,
    project
  });

  useEffect(() => {
    if (currentData) {
      console.log("Real-time data received:", currentData);
    }
  }, [currentData]);

  const handleSubmit = async () => {
    const newData = { name: "John Doe", age: 30 };
    const response = await upsertData(newData);
    if (response) {
      console.log("Data upserted successfully:", response);
    } else {
      console.error("Failed to upsert data.");
    }
  };

  return (
    <div>
      <button onClick={handleSubmit}>Upsert Data</button>
    </div>
  );
}
```

This guide covers the basic usage of WibuRealtime in your project.