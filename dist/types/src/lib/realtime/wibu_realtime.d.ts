import { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";
type RealtimeProps = {
    WIBU_REALTIME_TOKEN: string;
    project: "sdm" | "hipmi" | "test";
    url?: string;
    onData: (data: any) => void;
};
type RealtimeClient = SupabaseClient<any, "public", any>;
/**
 * # GUIDE
 * [useRealtime](https://github.com/bipproduction/wibu/blob/main/GUIDE/-wibu-realtime.md)
 *
 */
export declare class WibuRealtime {
    static supabase: RealtimeClient | null;
    static channel: RealtimeChannel | null;
    static project: string;
    static init({ WIBU_REALTIME_TOKEN, project, url, onData }: RealtimeProps): void;
    static setData(data: any): Promise<{
        status: number;
        data: any;
    } | null>;
    static cleanup(): void;
}
export {};
