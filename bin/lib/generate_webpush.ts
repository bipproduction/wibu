import webpush from "web-push";
import fs from "fs/promises";
import dedent from "dedent";
import loading from "loading-cli";
export async function generateWebpush() {
  const ld = loading("loading ...").start();
  // Generate VAPID keys
  const vapidKeys = webpush.generateVAPIDKeys();
  const text = dedent`
    Public Key: ${vapidKeys.publicKey}
    Private Key: ${vapidKeys.privateKey}
`;

  await fs.writeFile("webpush.txt", text, "utf8");
  console.log("Public Key:", vapidKeys.publicKey);
  console.log("Private Key:", vapidKeys.privateKey);
  ld.succeed("webpush generated");
  ld.stop();
}
