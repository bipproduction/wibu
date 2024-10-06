interface UseClientRealtimeProps {
    WIBU_REALTIME_TOKEN: string;
    project: "sdm" | "hipmi" | "test";
    url?: string;
}
/**
 *  # GUIDE
 *  [useRealtime](https://github.com/bipproduction/wibu/blob/main/GUIDE/use-wibu-realtime.md)
 */
export declare function useWibuRealtime({ WIBU_REALTIME_TOKEN, project, url }: UseClientRealtimeProps): readonly [any, (val: Record<string, any>) => Promise<{
    status: number;
    data: Record<string, any>;
} | null>];
export {};
