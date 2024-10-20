"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushDb = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
class PushDb {
    static supabase = null;
    static channel = null;
    static project;
    // Inisialisasi Supabase dan project
    static init({ WIBU_PUSH_DB_TOKEN, url = "https://zyjixsbusgbbtvjogjho.supabase.co/", onData, project }) {
        this.project = project;
        if (!this.supabase) {
            this.supabase = (0, supabase_js_1.createClient)(url, WIBU_PUSH_DB_TOKEN);
        }
        const channel = this.supabase
            .channel(this.project)
            .on("postgres_changes", { event: "*", schema: "public", table: this.project }, (payload) => {
            const data = payload.new?.data ?? null;
            if (data) {
                onData && onData(data);
            }
        })
            .subscribe();
        this.channel = channel;
    }
    // Metode untuk mengirim atau memperbarui data
    static async create({ id, data }) {
        if (!this.supabase || !this.project) {
            throw new Error("Realtime client or project not initialized.");
        }
        try {
            const { status, error } = await this.supabase
                .from(this.project)
                .insert({ id, data });
            if (error) {
                console.error("Error inserting data:", error);
                return null;
            }
            else {
                return { status, data };
            }
        }
        catch (error) {
            console.error("Error inserting data:", error);
            return null;
        }
    }
    static async createMany(data) {
        if (!this.supabase || !this.project) {
            throw new Error("Realtime client or project not initialized.");
        }
        try {
            const { status, error } = await this.supabase
                .from(this.project)
                .insert(data);
            if (error) {
                console.error("Error inserting data:", error);
                return null;
            }
            else {
                return { status, data };
            }
        }
        catch (error) {
            console.error("Error inserting data:", error);
            return null;
        }
    }
    static async findMany() {
        if (!this.supabase || !this.project) {
            throw new Error("Realtime client or project not initialized.");
        }
        try {
            const { data, error } = await this.supabase.from(this.project).select();
            if (error) {
                console.error("Error fetching data:", error);
                return null;
            }
            else {
                return data;
            }
        }
        catch (error) {
            console.error("Error fetching data:", error);
            return null;
        }
    }
    static async findOne(id) {
        if (!this.supabase || !this.project) {
            throw new Error("Realtime client or project not initialized.");
        }
        try {
            const { data, error } = await this.supabase
                .from(this.project)
                .select()
                .eq("id", id);
            if (error) {
                console.error("Error fetching data:", error);
                return null;
            }
            else {
                return data[0];
            }
        }
        catch (error) {
            console.error("Error fetching data:", error);
            return null;
        }
    }
    static async upsert({ id, data }) {
        if (!this.supabase || !this.project) {
            throw new Error("Realtime client or project not initialized.");
        }
        try {
            const { status, error } = await this.supabase
                .from(this.project)
                .upsert({ id, data });
            if (error) {
                console.error("Error upserting data:", error);
                return null;
            }
            else {
                return { status, data };
            }
        }
        catch (error) {
            console.error("Error upserting data:", error);
            return null;
        }
    }
    static async update(id, data) {
        if (!this.supabase || !this.project) {
            throw new Error("Realtime client or project not initialized.");
        }
        try {
            const { status, error } = await this.supabase
                .from(this.project)
                .update(data)
                .match({ id });
            if (error) {
                console.error("Error updating data:", error);
                return null;
            }
            else {
                return { status, data };
            }
        }
        catch (error) {
            console.error("Error updating data:", error);
            return null;
        }
    }
    static async delete(id) {
        if (!this.supabase || !this.project) {
            throw new Error("Realtime client or project not initialized.");
        }
        try {
            const { status, error } = await this.supabase
                .from(this.project)
                .delete()
                .match({ id });
            if (error) {
                console.error("Error deleting data:", error);
                return null;
            }
            else {
                return { status, data: id };
            }
        }
        catch (error) {
            console.error("Error deleting data:", error);
            return null;
        }
    }
    static async deleteMany() {
        if (!this.supabase || !this.project) {
            throw new Error("Realtime client or project not initialized.");
        }
        try {
            const { status, error } = await this.supabase
                .from(this.project)
                .delete()
                .match({});
            if (error) {
                console.error("Error deleting data:", error);
                return null;
            }
            else {
                return { status, data: null };
            }
        }
        catch (error) {
            console.error("Error deleting data:", error);
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
exports.PushDb = PushDb;
