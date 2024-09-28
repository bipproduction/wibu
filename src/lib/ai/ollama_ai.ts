export async function ollamaAi({
  token,
  prompt,
  stream = false
}: {
  token: string;
  prompt: string;
  stream?: boolean;
}): Promise<string> {
  const url = "https://wibu-ai.wibudev.com/api/ai/api/generate";
  const requestBody = {
    model: "codegeex4",
    prompt: prompt,
    stream: stream
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  });

  if (!res.ok) {
    console.error("Error:", res.statusText);
    return res.statusText;
  }

  const dataText = await res.text();
  try {
    const dataJson = JSON.parse(dataText);
    return dataJson.response;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return dataText;
  }
}
