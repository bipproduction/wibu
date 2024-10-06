import {
  createClient,
  RealtimeChannel,
  SupabaseClient
} from "@supabase/supabase-js";

type RealtimeProps = {
  WIBU_REALTIME_TOKEN: string;
  project: "sdm" | "hipmi" | "test";
  url?: string;
}

type RealtimeClient = SupabaseClient<any, "public", any>;

export class WibuRealtime {
  static supabase: RealtimeClient | null = null;
  static channel: RealtimeChannel | null = null;
  static project: string;

  // Inisialisasi Supabase dan project
  static init({
    WIBU_REALTIME_TOKEN,
    project,
    url = "https://zyjixsbusgbbtvjogjho.supabase.co/"
  }: RealtimeProps) {
    this.project = project;
    this.supabase = createClient(url, WIBU_REALTIME_TOKEN);
  }

  // Metode untuk inisialisasi Supabase Realtime
  static subscribeToRealtime(onData: (data: any) => void) {
    if (!this.supabase || !this.project) {
      throw new Error("Realtime client or project not initialized.");
    }

    const channel = this.supabase
      .channel(this.project)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: this.project },
        (payload: any) => {
          const data = payload.new?.data ?? null;
          if (data) {
            onData(data);
          }
        }
      )
      .subscribe();

    this.channel = channel;
  }

  // Metode untuk mengirim atau memperbarui data
  static async setData(data: any, id: string = "123e4567-e89b-12d3-a456-426614174000") {
    if (!this.supabase || !this.project) {
      throw new Error("Realtime client or project not initialized.");
    }

    try {
      const { status, error } = await this.supabase.from(this.project).upsert({
        id, // ID bisa disesuaikan dengan skema data
        data
      });

      if (error) {
        console.error("Error upserting data:", error);
        return null;
      } else {
        return { status, data };
      }
    } catch (error) {
      console.error("Error performing upsert:", error);
      return null;
    }
  }

  // Bersihkan channel saat tidak lagi diperlukan
  static cleanup() {
    if (this.channel && this.supabase) {
      this.supabase.removeChannel(this.channel);
      this.channel = null;
      console.log("Realtime channel cleaned up");
    } else {
      console.warn("No channel to clean up.");
    }
  }
}
