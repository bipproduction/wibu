import path from "path";
import fs from "fs/promises";
const rootDir = path.join(process.cwd(), "src/lib");

const text = `
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
`;
export async function generatePrisma() {
  await fs.mkdir(rootDir, { recursive: true });
  await fs.writeFile(path.join(rootDir, "prisma.ts"), text, "utf8");
  console.log("prisma generated", path.join(rootDir, "prisma.ts"));
}
