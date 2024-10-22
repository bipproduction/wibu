"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.push = push;
const os_1 = __importDefault(require("os"));
const child_process_1 = require("child_process");
const gpt_3_encoder_1 = __importDefault(require("gpt-3-encoder"));
const loading_cli_1 = __importDefault(require("loading-cli"));
const util_1 = __importDefault(require("util"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const gemini_ai_1 = require("../../src/lib/ai/gemini_ai");
const execPromise = util_1.default.promisify(child_process_1.exec);
const promptSystem = `
Anda adalah commit generator yang ahli.

Tugas:
  - Saya ingin Anda membantu saya membuat pesan commit git yang jelas, singkat, dan sesuai dengan standard commit konvensional. 
  - Format commit harus menggunakan bahasa Indonesia.
  - berikan descripsi yang jelas dan detail

Persyaratan:
  - Judul tidak lebih dari 50 karakter.
  - Gunakan kata kerja dalam bentuk imperatif: seperti "fix", "add", "update", "remove".
  - Hindari commit umum seperti "update" atau "fix bugs" tanpa detail.
  - Gunakan type commit: 
    - feat: untuk fitur baru.
    - fix: untuk perbaikan bug.
    - docs: untuk perubahan dokumentasi.
    - style: untuk perubahan gaya kode.
    - refactor: untuk perubahan kode tanpa mengubah fungsionalitas.
    - chore: untuk tugas-tugas pemeliharaan.
`;
async function push(branch) {
    const log = (0, loading_cli_1.default)("loading ...").start();
    const currentBranch = await execPromise("git branch --show-current");
    const branchName = branch || currentBranch.stdout.trim();
    let { stdout } = await execPromise("git diff --stat --unified=1 --ignore-space-change --diff-filter=ACMRT && git status");
    const { length } = gpt_3_encoder_1.default.encode(stdout);
    if (length === 0) {
        return log.fail("nothing to push");
    }
    if (length > 2000) {
        stdout = stdout.substring(0, 2000);
    }
    let loadingText = "Processing...";
    const text = await (0, gemini_ai_1.geminiAi)({
        system: promptSystem,
        user: stdout,
        onStream: (data) => {
            if (data) {
                console.clear();
                loadingText += ".";
                log.info(loadingText);
            }
        }
    });
    if (!text) {
        return log.fail("failed to generate commit message");
    }
    // Create a temporary file for the commit message
    const tmpFilePath = path_1.default.join(os_1.default.tmpdir(), `commit_message.txt`);
    await promises_1.default.writeFile(tmpFilePath, text);
    try {
        await execPromise(`git add -A && git commit --file="${tmpFilePath}" && git push origin ${branchName}`);
        log.succeed("success to push commit branch " + branchName);
        log.stop();
    }
    catch (error) {
        log.fail("failed to push commit branch " + branchName);
        log.stop();
        console.error(error);
    }
    finally {
        try {
            await promises_1.default.access(tmpFilePath); // Check if the file exists
            await promises_1.default.unlink(tmpFilePath); // Asynchronously delete the file
        }
        catch (err) {
            if (err.code !== "ENOENT") {
                // Rethrow the error if it's not a "file not found" error
                throw err;
            }
        }
    }
}
