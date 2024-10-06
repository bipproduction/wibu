"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WibuRealtime = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
class WibuRealtime {
    supabase;
    channel = null;
    project;
    constructor({ WIBU_REALTIME_TOKEN, project, url = "https://zyjixsbusgbbtvjogjho.supabase.co/" }) {
        this.project = project;
        this.supabase = (0, supabase_js_1.createClient)(url, WIBU_REALTIME_TOKEN);
    }
    // Fungsi callback untuk menangani data yang diterima
    onData = (data) => {
        console.log("New data received:", data);
    };
    async setData(data) {
        try {
            const { status, error } = await this.supabase.from(this.project).upsert({
                id: "123e4567-e89b-12d3-a456-426614174000", // ID bisa disesuaikan dengan skema data
                data
            });
            if (error) {
                console.error("Error upserting data:", error);
                return null;
            }
            else {
                return { status, data };
            }
        }
        catch (error) {
            console.error("Error performing upsert:", error);
            return null;
        }
    }
    // Metode untuk inisialisasi Supabase Realtime
    init() {
        const channel = this.supabase
            .channel(this.project) // Nama channel diambil dari nama proyek
            .on("postgres_changes", { event: "*", schema: "public", table: this.project }, (payload) => {
            const data = payload.new?.data ?? null;
            data && this.onData(data); // Panggil callback onData
        })
            .subscribe();
        this.channel = channel; // Simpan channel
    }
    // Bersihkan channel saat tidak lagi diperlukan
    cleanup() {
        if (this.channel) {
            this.supabase.removeChannel(this.channel);
            this.channel = null;
            console.log("Realtime channel cleaned up");
        }
    }
}
exports.WibuRealtime = WibuRealtime;
