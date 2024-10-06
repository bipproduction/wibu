type RealtimeProps = {
    WIBU_REALTIME_TOKEN: string;
    project: "sdm" | "hipmi" | "test";
    url?: string;
};
export declare class WibuRealtime {
    private supabase;
    private channel;
    private project;
    constructor({ WIBU_REALTIME_TOKEN, project, url }: RealtimeProps);
    onData: (data: any) => void;
    setData(data: any): Promise<{
        status: number;
        data: any;
    } | null>;
    init(): void;
    cleanup(): void;
}
export {};
