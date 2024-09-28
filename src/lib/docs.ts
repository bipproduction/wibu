import { path as appRootPath } from "app-root-path";
import path from "path";
import dotenv from "dotenv";
import { Octokit } from "@octokit/core";

dotenv.config({
  path: path.join(appRootPath, ".env")
});

const WIBU_GITHUB = process.env.WIBU_GITHUB!;
const octokit = new Octokit({ auth: WIBU_GITHUB });
export async function docs() {
  syncFork();
}

export async function syncFork() {
  // Nama owner dari repositori utama (bipproduction) dan fork (malikkurosaki)
  const upstreamOwner = "bipproduction";
  const upstreamRepo = "wibu-example";
  const forkOwner = "malikkurosaki";
  const forkRepo = "wibu-example";

  // Membuat Pull Request dari branch main repositori utama ke fork kamu
  const pullRequest = await octokit.request(
    "POST /repos/{owner}/{repo}/pulls",
    {
      owner: forkOwner, // Pemilik fork kamu (malikkurosaki)
      repo: "hipmi", // Nama repositori fork (wibu-example)
      title: "Sync with upstream", // Judul Pull Request
      head: `${upstreamOwner}:main`, // branch repositori upstream (main)
      base: "main" // Branch di fork kamu yang akan menerima update
    }
  );

  console.log("Pull Request created:", pullRequest.data.html_url);
}
syncFork();

export async function checkIfSyncNeeded() {
  // Pemilik repositori upstream dan fork
  const upstreamOwner = "bipproduction";
  const upstreamRepo = "wibu-example";
  const forkOwner = "malikkurosaki";
  const forkRepo = "wibu-example";

  // Membandingkan branch 'main' di fork dengan branch 'main' di upstream
  const comparison = await octokit.request('GET /repos/{owner}/{repo}/compare/{base}...{head}', {
    owner: forkOwner,    // Pemilik fork kamu
    repo: forkRepo,      // Repositori fork kamu
    base: 'main',        // Branch di fork kamu
    head: `${upstreamOwner}:main`,  // Branch upstream
  });

  // Menampilkan hasil perbandingan
  if (comparison.data.behind_by > 0) {
    console.log(`Fork kamu ketinggalan ${comparison.data.behind_by} commit dari upstream. Sinkronisasi diperlukan.`);
    return true;
  } else {
    console.log("Fork kamu sudah up to date dengan upstream. Tidak perlu sinkronisasi.");
    return false;
  }
}
