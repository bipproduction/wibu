# Supabase Realtime Hook Documentation

This package provides a custom React hook `useWibuRealtime` to initialize a real-time connection with Supabase and manage the data it retrieves.

## Installation

To use this hook, you need to have the following dependencies installed:

```bash
npm install @supabase/supabase-js jose
# or
yarn add @supabase/supabase-js jose
```

## Usage

### Hook: `useWibuRealtime`

This hook initializes a real-time connection to Supabase using the provided project configuration. It subscribes to changes in a specified table and provides an interface to upsert (insert or update) data into the database.

### Parameters

- `WIBU_REALTIME_TOKEN`: The JWT token used for authenticating with the Supabase API.
- `project`: The project name, which should be either `"sdm"` or `"hipmi"`. This will define the table and channel used for real-time updates.

### Return Value

The hook returns a tuple containing:
1. `currentData`: The latest data retrieved from the Supabase table (can be `null` if no data is available).
2. `upsertData`: A function to insert or update data into the Supabase table.

### Example Usage

```tsx
import { useWibuRealtime } from 'wibu';

const MyComponent = () => {
  // Initialize the hook with the token and project name
  const WIBU_REALTIME_TOKEN = 'your_jwt_token_here';
  const project = 'sdm';
  const [currentData, upsertData] = useWibuRealtime({ WIBU_REALTIME_TOKEN, project });

  const handleSubmit = async () => {
    // Example data to upsert
    const dataToUpsert = {
      name: "John Doe",
      age: 30,
      role: "Developer"
    };

    // Call the upsertData function to save data
    const result = await upsertData(dataToUpsert);
    console.log(result);
  };

  return (
    <div>
      <h1>Latest Data:</h1>
      <pre>{JSON.stringify(currentData, null, 2)}</pre>
      <button onClick={handleSubmit}>Submit Data</button>
    </div>
  );
};
```

### Function Details

#### `useWibuRealtime({ WIBU_REALTIME_TOKEN, project })`

- Initializes the real-time connection to the specified Supabase table (`project`).
- Subscribes to changes in the table and updates `currentData` whenever new data is available.
- Manages the connection lifecycle, ensuring proper cleanup when the component is unmounted.

#### `upsertData(val: Record<string, any>)`

- Upserts (inserts or updates) data into the Supabase table defined by the `project` parameter.
- Returns a response object containing the status and the value that was upserted.

### Error Handling

If an error occurs during initialization or data operations, it will be logged to the console. Be sure to handle these errors in your application accordingly.

### Dependencies

- **@supabase/supabase-js**: For creating the Supabase client and managing real-time connections.
- **jose**: For verifying JWT tokens.

## License

MIT License

### Notes:
- Be sure to replace `'your_jwt_token_here'` with the actual JWT token in your application.
- This example assumes the use of TypeScript. If you're using plain JavaScript, you may need to adjust the types accordingly.