import os from "os";
import { exec } from "child_process";
import encoder from "gpt-3-encoder";
import loading from "loading-cli";
import util from "util";
import path from "path";
import fs from "fs/promises";
import { geminiAi } from "../../src/lib/ai/gemini_ai";
const execPromise = util.promisify(exec);

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

export async function push(branch?: string) {
  const log = loading("loading ...").start();

  const currentBranch = await execPromise("git branch --show-current");
  const branchName = branch || currentBranch.stdout.trim();

  let { stdout } = await execPromise(
    "git diff --stat --unified=1 --ignore-space-change --diff-filter=ACMRT"
  );
  const { length } = encoder.encode(stdout);
  if (length === 0) {
    return log.fail("nothing to push");
  }
  if (length > 2000) {
    stdout = stdout.substring(0, 2000);
  }
  let loadingText = "Processing...";
  const text = await geminiAi({
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
  const tmpFilePath = path.join(
    os.tmpdir(),
    `commit_message.txt`
  );
  await fs.writeFile(tmpFilePath, text);

  try {
    await execPromise(
      `npx standard-version --yes --tag-prefix "" --release-as ${branchName} && git add -A && git commit --file="${tmpFilePath}" && git push origin ${branchName}`
    );

    log.succeed("success to push commit branch " + branchName);
    log.stop();
  } catch (error) {
    log.fail("failed to push commit branch " + branchName);
    log.stop();
    console.error(error);
  } finally {
    try {
      await fs.access(tmpFilePath); // Check if the file exists
      await fs.unlink(tmpFilePath); // Asynchronously delete the file
    } catch (err: any) {
      if (err.code !== "ENOENT") {
        // Rethrow the error if it's not a "file not found" error
        throw err;
      }
    }
  }
}
