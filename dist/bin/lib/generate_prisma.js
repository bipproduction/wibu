"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePrisma = generatePrisma;
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const rootDir = path_1.default.join(process.cwd(), "src/lib");
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
async function generatePrisma() {
    await promises_1.default.mkdir(rootDir, { recursive: true });
    await promises_1.default.writeFile(path_1.default.join(rootDir, "prisma.ts"), text, "utf8");
    console.log("prisma generated", path_1.default.join(rootDir, "prisma.ts"));
}
