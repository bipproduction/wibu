"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WibuRealtime = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
/**
 * # GUIDE
 * [useRealtime](https://github.com/bipproduction/wibu/blob/main/GUIDE/-wibu-realtime.md)
 *
 */
class WibuRealtime {
    static supabase = null;
    static channel = null;
    static project;
    // Inisialisasi Supabase dan project
    static init({ WIBU_REALTIME_TOKEN, project, url = "https://zyjixsbusgbbtvjogjho.supabase.co/", onData }) {
        this.project = project;
        if (!this.supabase) {
            this.supabase = (0, supabase_js_1.createClient)(url, WIBU_REALTIME_TOKEN);
        }
        const channel = this.supabase
            .channel(this.project)
            .on("postgres_changes", { event: "*", schema: "public", table: this.project }, (payload) => {
            const data = payload.new?.data ?? null;
            if (data) {
                onData(data);
            }
        })
            .subscribe();
        this.channel = channel;
    }
    // Metode untuk mengirim atau memperbarui data
    static async setData(data) {
        if (!this.supabase || !this.project) {
            throw new Error("Realtime client or project not initialized.");
        }
        try {
            const { status, error } = await this.supabase.from(this.project).upsert({
                id: "123e4567-e89b-12d3-a456-426614174000", // ID bisa disesuaikan dengan skema data
                data,
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
    // Bersihkan channel saat tidak lagi diperlukan
    static cleanup() {
        if (this.channel && this.supabase) {
            this.supabase.removeChannel(this.channel);
            this.channel = null;
            console.log("Realtime channel cleaned up.");
        }
    }
}
exports.WibuRealtime = WibuRealtime;
