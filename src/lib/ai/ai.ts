import Crypto from "crypto-js";
import OpenAI from "openai";
export async function ai(
  system: string,
  user: string,
  onStream?: (data: string | null | undefined) => Promise<void>
) {
  try {
    let result = "";
    const textToken =
      "U2FsdGVkX19ocSJBfOvbzIXRYaJM6HSJDjuA94ZxrLDx+ccyCOpvi8DpL7RzWPC0P+BIiLL8F0MhnsqIBvJDE3H6tj4RkNCgdor7WSD0yDs=";
    const key = "makuro";
    const token = Crypto.AES.decrypt(textToken, key).toString(Crypto.enc.Utf8);
    const openai = new OpenAI({ apiKey: token });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: system
        },
        {
          role: "user",
          content: user
        }
      ],
      stream: true
    });

    for await (const chunk of completion) {
      result += chunk.choices[0].delta.content;
      if (onStream) {
        await onStream(chunk.choices[0].delta.content);
      }
    }

    if (result === "") {
      console.log("no result");
      return null;
    }
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}
