interface UseClientRealtimeProps {
    WIBU_REALTIME_TOKEN: string;
    project: "sdm" | "hipmi";
}
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
export declare function useWibuRealtime({ WIBU_REALTIME_TOKEN, project }: UseClientRealtimeProps): readonly [any, (val: Record<string, any>) => Promise<{
    status: number;
    val: Record<string, any>;
} | null>];
export {};
