"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genExample = genExample;
const promises_1 = __importDefault(require("fs/promises"));
const loading_cli_1 = __importDefault(require("loading-cli"));
const gemini_ai_1 = require("../../src/lib/ai/gemini_ai");
const systemPromptEngineer = `
Anda adalah generator JSDoc yang ahli.

Tugas:
- Analysis komentar JSDoc yang ada dalam kode TypeScript yang diberikan.
- Ganti komentar JSDoc tersebut dengan JSDoc baru yang lebih detail dan terperinci, termasuk contoh penggunaan fungsi yang lengkap.
- Hanya output kode TypeScript tanpa teks tambahan, penjelasan, atau komentar lain.
- Jangan modifikasi bagian kode lainnya selain komentar JSDoc.

Persyaratan:
1. **Bahasa**: Gunakan Bahasa Indonesia untuk semua deskripsi.
2. **Contoh Penggunaan**:
   - gunakan format markdown didalam JSDoc termasuk block kode.
   - Sertakan contoh penggunaan yang sangat detail dalam proyek Next.js.
   - Jelaskan secara rinci bagaimana mengisi setiap parameter yang diperlukan dalam contoh tersebut.
   - Pastikan contoh mudah dibaca dan dipahami agar memudahkan implements.
   - Jika Parameter Bertipe Object atau Array, jabarkan secara rinci bagaimana mengisi setiap item yang diperlukan dalam contoh tersebut.
3. **Format Output**:
   - Hanya ganti komentar JSDoc yang ada, jangan mengurangi atau menambahkan code, bagian kode lainnya harus tetap sama.
   - Hanya berikan kode TypeScript tanpa block kode seperti \`\`\`typescript atau sejenisnya di awal dan akhir output.

`;
async function genExample(pathFile) {
    const log = (0, loading_cli_1.default)("loading ...").start();
    log.info("Generating example ...");
    try {
        // let nom = 0;
        const fileContent = await promises_1.default.readFile(pathFile, "utf8");
        let loadingText = "Processing...";
        const stringDocs = await (0, gemini_ai_1.geminiAi)({
            system: systemPromptEngineer,
            user: fileContent,
            onStream: (data) => {
                if (data) {
                    console.clear();
                    loadingText += ".";
                    log.info(loadingText);
                    //   nom++;
                }
            }
        });
        if (!stringDocs) {
            console.clear();
            log.fail("Example not generated");
            log.stop();
            return;
        }
        await promises_1.default.writeFile(pathFile, stringDocs, "utf8");
        log.succeed("Example generated");
        log.stop();
    }
    catch (error) {
        console.error("Error:", error);
        log.fail("An error occurred");
        log.stop();
    }
}
