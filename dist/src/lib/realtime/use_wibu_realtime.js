"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWibuRealtime = useWibuRealtime;
const supabase_js_1 = require("@supabase/supabase-js");
const jose_1 = require("jose");
const react_1 = require("react");
/**
 * Hook ini digunakan untuk menginisialisasi koneksi realtime dengan Supabase dan mengelola data yang diperoleh darinya.
 *
 * @param param0 - Parameter konfigurasi untuk koneksi realtime.
 * @param param0.WIBU_REALTIME_TOKEN - Token yang digunakan untuk verifikasi JWT saat menginisialisasi Supabase.
 * @param param0.project - Nama proyek yang digunakan, dapat berupa "sdm" atau "hipmi".
 *
 * @returns Sebuah array yang berisi dua elemen:
 * - Elemen pertama adalah data terkini yang diterima dari Supabase (bisa `null` jika tidak ada data).
 * - Elemen kedua adalah fungsi `upsertData` yang digunakan untuk menyimpan atau memperbarui data.
 *
 * Contoh Penggunaan:
 *
 * ```tsx
 * import { useWibuRealtime } from './path/to/your/hook';
 *
 * const MyComponent = () => {
 *   // Inisialisasi hook dengan token dan nama proyek
 *   const WIBU_REALTIME_TOKEN = 'token_anda_disini';
 *   const project = 'sdm';
 *   const [currentData, upsertData] = useWibuRealtime({ WIBU_REALTIME_TOKEN, project });
 *
 *   const handleSubmit = async () => {
 *     // Contoh data yang ingin di-upsert
 *     const dataToUpsert = {
 *       name: "John Doe",
 *       age: 30,
 *       role: "Developer"
 *     };
 *
 *     // Memanggil fungsi upsertData untuk menyimpan data
 *     const result = await upsertData(dataToUpsert);
 *     console.log(result);
 *   };
 *
 *   return (
 *     <div>
 *       <h1>Data Terkini:</h1>
 *       <pre>{JSON.stringify(currentData, null, 2)}</pre>
 *       <button onClick={handleSubmit}>Kirim Data</button>
 *     </div>
 *   );
 * };
 * ```
 */
function useWibuRealtime({ WIBU_REALTIME_TOKEN, project }) {
    const supabaseRef = (0, react_1.useRef)(null);
    const channelRef = (0, react_1.useRef)(null);
    const [currentData, setCurrentData] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        let isMounted = true;
        const initializeRealtime = async () => {
            try {
                const token = "eyJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJodHRwczovL3p5aml4c2J1c2diYnR2am9namhvLnN1cGFiYXNlLmNvIiwia2V5IjoiZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBjM01pT2lKemRYQmhZbUZ6WlNJc0luSmxaaUk2SW5wNWFtbDRjMkoxYzJkaVluUjJhbTluYW1odklpd2ljbTlzWlNJNkltRnViMjRpTENKcFlYUWlPakUzTWpZM016azFORFVzSW1WNGNDSTZNakEwTWpNeE5UVTBOWDAuakhOVzVQd2hqLUtYVVFPTXF6SUxhQXo2MmszeGxLRUw1WEtFNHhvUjdYYyJ9.liCfw07nhEx_us1tV82I_osAQZxcMlolsOBA016A6S0";
                const { payload } = await (0, jose_1.jwtVerify)(token, new TextEncoder().encode(WIBU_REALTIME_TOKEN));
                const { url, key } = payload;
                const supabase = (0, supabase_js_1.createClient)(url, key);
                supabaseRef.current = supabase;
                const channel = supabase
                    .channel(project)
                    .on("postgres_changes", { event: "*", schema: "public", table: project }, (payload) => {
                    const data = payload.new?.data ?? null;
                    if (isMounted) {
                        setCurrentData(data);
                    }
                })
                    .subscribe();
                channelRef.current = channel;
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
                channelRef.current = null;
            }
            supabaseRef.current = null;
        };
    }, [WIBU_REALTIME_TOKEN, project]);
    async function upsertData(val) {
        const supabase = supabaseRef.current;
        if (!supabase) {
            console.error("Supabase client not initialized");
            return null;
        }
        try {
            const { status, error } = await supabase.from(project).upsert({
                id: "123e4567-e89b-12d3-a456-426614174000",
                data: val
            });
            if (error) {
                console.error("Error upserting data:", error);
                return null;
            }
            else {
                return {
                    status,
                    val
                };
            }
        }
        catch (error) {
            console.error("Error performing upsert:", error);
            return null;
        }
    }
    return [currentData, upsertData];
}
undefined;
