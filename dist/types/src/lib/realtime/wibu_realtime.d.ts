import { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";
type RealtimeProps = {
    WIBU_REALTIME_TOKEN: string;
    project: "sdm" | "hipmi" | "test";
    url?: string;
};
type RealtimeClient = SupabaseClient<any, "public", any>;
export declare class WibuRealtime {
    static supabase: RealtimeClient | null;
    static channel: RealtimeChannel | null;
    static project: string;
    static init({ WIBU_REALTIME_TOKEN, project, url }: RealtimeProps): void;
    static subscribeToRealtime(onData: (data: any) => void): void;
    static setData(data: any, id?: string): Promise<{
        status: number;
        data: any;
    } | null>;
    static cleanup(): void;
}
export {};
