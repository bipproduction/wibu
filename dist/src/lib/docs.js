"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.docs = docs;
exports.syncFork = syncFork;
exports.checkIfSyncNeeded = checkIfSyncNeeded;
const app_root_path_1 = require("app-root-path");
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const core_1 = require("@octokit/core");
dotenv_1.default.config({
    path: path_1.default.join(app_root_path_1.path, ".env")
});
const WIBU_GITHUB = process.env.WIBU_GITHUB;
const octokit = new core_1.Octokit({ auth: WIBU_GITHUB });
async function docs() {
    syncFork();
}
async function syncFork() {
    // Nama owner dari repositori utama (bipproduction) dan fork (malikkurosaki)
    const upstreamOwner = "bipproduction";
    const upstreamRepo = "wibu-example";
    const forkOwner = "malikkurosaki";
    const forkRepo = "wibu-example";
    // Membuat Pull Request dari branch main repositori utama ke fork kamu
    const pullRequest = await octokit.request("POST /repos/{owner}/{repo}/pulls", {
        owner: forkOwner, // Pemilik fork kamu (malikkurosaki)
        repo: "hipmi", // Nama repositori fork (wibu-example)
        title: "Sync with upstream", // Judul Pull Request
        head: `${upstreamOwner}:main`, // branch repositori upstream (main)
        base: "main" // Branch di fork kamu yang akan menerima update
    });
    console.log("Pull Request created:", pullRequest.data.html_url);
}
syncFork();
async function checkIfSyncNeeded() {
    // Pemilik repositori upstream dan fork
    const upstreamOwner = "bipproduction";
    const upstreamRepo = "wibu-example";
    const forkOwner = "malikkurosaki";
    const forkRepo = "wibu-example";
    // Membandingkan branch 'main' di fork dengan branch 'main' di upstream
    const comparison = await octokit.request('GET /repos/{owner}/{repo}/compare/{base}...{head}', {
        owner: forkOwner, // Pemilik fork kamu
        repo: forkRepo, // Repositori fork kamu
        base: 'main', // Branch di fork kamu
        head: `${upstreamOwner}:main`, // Branch upstream
    });
    // Menampilkan hasil perbandingan
    if (comparison.data.behind_by > 0) {
        console.log(`Fork kamu ketinggalan ${comparison.data.behind_by} commit dari upstream. Sinkronisasi diperlukan.`);
        return true;
    }
    else {
        console.log("Fork kamu sudah up to date dengan upstream. Tidak perlu sinkronisasi.");
        return false;
    }
}
