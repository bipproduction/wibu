```tsx
"use client";
import { apies, pages } from "@/lib/routes";
import { useWibuRef } from "wibu";
import {
  Button,
  Card,
  Container,
  Group,
  PasswordInput,
  Stack,
  TextInput,
  Title
} from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function Page() {
  // const [registerForm, setregisterForm] = useState(defaultForm);
  const ref = useRef<any[]>([]);
  const {value: registerForm, wibuNext: next, error, empty} = useWibuRef({
    initialRef: ref,
    initialValue: {
      name: "",
      email: "",
      password: ""
    }
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();


  async function onSubmit() {
    try {
      setLoading(true);

      if (empty) {
        return alert("Please fill all the fields");
      }

      const res = await fetch(apies["/api/register"], {
        method: "POST",
        body: JSON.stringify(registerForm)
      });

      if (res.ok) {
        return router.push(pages["/login"]);
      }

      console.log(res.status, await res.text());
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack>
      <Container w={460}>
        <Card>
          <Stack>
            <Title order={3}>Register</Title>
            <TextInput
              {...next("name")}
              placeholder="example: jhone doe"
              label="name"
            />
            <TextInput
              {...next("email")}
              placeholder="example: 0t3I5@example.com"
              label="email"
            />
            <PasswordInput
              {...next("password")}
              placeholder="********"
              label="password"
            />
            <Group justify="right">
              <Button
                variant="transparent"
                size="compact-xs"
                component={Link}
                href={pages["/login"]}
              >
                login
              </Button>
            </Group>
            <Button loading={loading} disabled={loading || error !== null || empty} onClick={onSubmit}>
              Register
            </Button>
          </Stack>
        </Card>
      </Container>
    </Stack>
  );
}

```