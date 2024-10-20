"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWebpush = generateWebpush;
const web_push_1 = __importDefault(require("web-push"));
const promises_1 = __importDefault(require("fs/promises"));
const dedent_1 = __importDefault(require("dedent"));
const loading_cli_1 = __importDefault(require("loading-cli"));
async function generateWebpush() {
    const ld = (0, loading_cli_1.default)("loading ...").start();
    // Generate VAPID keys
    const vapidKeys = web_push_1.default.generateVAPIDKeys();
    const text = (0, dedent_1.default) `
    Public Key: ${vapidKeys.publicKey}
    Private Key: ${vapidKeys.privateKey}
`;
    await promises_1.default.writeFile("webpush.txt", text, "utf8");
    console.log("Public Key:", vapidKeys.publicKey);
    console.log("Private Key:", vapidKeys.privateKey);
    ld.succeed("webpush generated");
    ld.stop();
}
