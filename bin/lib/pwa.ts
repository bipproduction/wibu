import path from "path";
import fs from "fs/promises";


const listPath = [
  "public/wibu_worker.js",
  "src/app/manifest.ts",
  "src/lib/prisma.ts",
  "src/lib/urlB64ToUint8Array.ts",
  "src/lib/usePushNotifications.ts",
  "src/lib/usePWAInstall.ts",
  "src/app/api/get-subscribe/route.ts",
  "src/app/api/send-notification/route.ts",
  "src/app/api/set-subscribe/route.ts",
  "src/app/api/unsubscribe/route.ts",
  "public/icon-192x192.png"
];


export async function install() {
  const totalFiles = listPath.length;
  let processedFiles = 0;



  for (const filePath of listPath) {
    await processFile(filePath);
    processedFiles++;
  }

  console.log("Install process completed!");
}

export async function uninstall() {
  const totalFiles = listPath.length;
  let processedFiles = 0;

  for (const filePath of listPath) {
    await deleteFile(filePath);
    processedFiles++;
  }

  console.log("Uninstall process completed!");
}

async function processFile(filePath: string) {
  const fullPath = path.join(process.cwd(), filePath);

  try {
    const fileExists = await fs.access(fullPath).then(() => true).catch(() => false);

    if (fileExists) {
      console.log(filePath, "File already exists");
    } else {
      const isImage = checkIfImage(filePath);
      if (isImage) {
        const imageBuffer = await fetchImage(filePath);
        await createFile(fullPath, imageBuffer, true);
        console.log(filePath, "Image file created successfully");
      } else {
        const text = await fetchFileContent(filePath);
        await createFile(fullPath, text);
        console.log(filePath, "Text file created successfully");
      }
    }
  } catch (error) {
    console.error("Error processing", filePath, ":", error);
  }
}

async function deleteFile(filePath: string) {
  const fullPath = path.join(process.cwd(), filePath);

  try {
    const fileExists = await fs.access(fullPath).then(() => true).catch(() => false);

    if (fileExists) {
      await fs.unlink(fullPath); // Hapus file
      console.log(filePath, "File deleted successfully");
    } else {
      console.log(filePath, "File does not exist");
    }
  } catch (error) {
    console.error("Error deleting", filePath, ":", error);
  }

  try {
    const dirPath = path.dirname(fullPath);
    await fs.rmdir(dirPath, { recursive: false }); // Hanya hapus jika direktori kosong
  } catch (err: any) {
    if (err.code !== "ENOTEMPTY" && err.code !== "ENOENT") {
      console.error(`Error deleting directory: ${path.dirname(fullPath)}`, err);
    }
  }
}

function checkIfImage(filePath: string): boolean {
  const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".bmp"];
  return imageExtensions.some((ext) => filePath.endsWith(ext));
}

async function fetchFileContent(filePath: string): Promise<string> {
  const response = await fetch(
    `https://raw.githubusercontent.com/bipproduction/webpush-example/main/${filePath}`
  );
  return response.text();
}

async function fetchImage(filePath: string): Promise<Buffer> {
  const response = await fetch(
    `https://raw.githubusercontent.com/bipproduction/webpush-example/main/${filePath}`
  );
  return response.arrayBuffer() as unknown as Buffer;
}

async function createFile(
  fullPath: string,
  content: string | Buffer,
  isBinary = false
) {
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  if (isBinary) {
    await fs.writeFile(fullPath, Buffer.from(content)); // Menulis file gambar dalam bentuk biner
  } else {
    await fs.writeFile(fullPath, content); // Menulis file teks
  }
}
