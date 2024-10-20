import { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";
type DbClient = SupabaseClient<any, "public", any>;
type DbProps = {
    WIBU_PUSH_DB_TOKEN: string;
    url?: string;
    project: "push-notification";
    onData?: (data: any) => void;
};
export declare class PushDb {
    static supabase: DbClient | null;
    static channel: RealtimeChannel | null;
    static project: string;
    static init({ WIBU_PUSH_DB_TOKEN, url, onData, project }: DbProps): void;
    static create({ id, data }: {
        id?: string;
        data: any;
    }): Promise<{
        status: number;
        data: any;
    } | null>;
    static createMany(data: any[]): Promise<{
        status: number;
        data: any[];
    } | null>;
    static findMany(): Promise<any[] | null>;
    static findOne(id: string): Promise<any>;
    static upsert({ id, data }: {
        id?: string;
        data: any;
    }): Promise<{
        status: number;
        data: any;
    } | null>;
    static update(id: string, data: any): Promise<{
        status: number;
        data: any;
    } | null>;
    static delete(id: string): Promise<{
        status: number;
        data: string;
    } | null>;
    static deleteMany(): Promise<{
        status: number;
        data: null;
    } | null>;
    static cleanup(): void;
}
export {};
