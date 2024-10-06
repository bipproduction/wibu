"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWibuRealtime = useWibuRealtime;
const supabase_js_1 = require("@supabase/supabase-js");
const react_1 = require("react");
/**
 *  # GUIDE
 *  [useRealtime](https://github.com/bipproduction/wibu/blob/main/GUIDE/use-wibu-realtime.md)
 */
function useWibuRealtime({ WIBU_REALTIME_TOKEN, project, url = "https://zyjixsbusgbbtvjogjho.supabase.co/" }) {
    const supabaseRef = (0, react_1.useRef)(null);
    const channelRef = (0, react_1.useRef)(null);
    const [currentData, setCurrentData] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        let isMounted = true;
        const initializeRealtime = async () => {
            try {
                if (!supabaseRef.current) {
                    supabaseRef.current = (0, supabase_js_1.createClient)(url, WIBU_REALTIME_TOKEN);
                }
                if (!channelRef.current) {
                    channelRef.current = supabaseRef.current
                        .channel(project)
                        .on("postgres_changes", { event: "*", schema: "public", table: project }, (payload) => {
                        const data = payload.new?.data ?? null;
                        if (isMounted) {
                            setCurrentData(data);
                        }
                    })
                        .subscribe();
                }
            }
            catch (error) {
                console.error("Error initializing realtime:", error);
            }
        };
        initializeRealtime();
        return () => {
            isMounted = false;
            if (channelRef.current && supabaseRef.current) {
                supabaseRef.current.removeChannel(channelRef.current);
                channelRef.current.unsubscribe(); // Pastikan untuk unsubscribe dulu
                channelRef.current = null;
            }
            supabaseRef.current = null;
        };
    }, [WIBU_REALTIME_TOKEN, project, url]); // Tambahkan `url` ke dependency array
    async function upsertData(val) {
        const supabase = supabaseRef.current;
        if (!supabase) {
            console.error("Database client not initialized");
            return null;
        }
        try {
            const { status, error } = await supabase.from(project).upsert({
                id: "123e4567-e89b-12d3-a456-426614174000", // ID bisa disesuaikan dengan skema data
                data: val
            });
            if (error) {
                console.error("Error upserting data:", error);
                return null;
            }
            else {
                return { status, data: val };
            }
        }
        catch (error) {
            console.error("Error performing upsert:", error);
            return null;
        }
    }
    return [currentData, upsertData];
}
