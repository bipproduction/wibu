import {
  createClient,
  RealtimeChannel,
  SupabaseClient
} from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";

interface UseClientRealtimeProps {
  WIBU_REALTIME_TOKEN: string;
  project: "sdm" | "hipmi" | "test";
  url?: string;
}


/**
 *  # GUIDE 
 *  [useRealtime](https://github.com/bipproduction/wibu/blob/main/GUIDE/use-wibu-realtime.md)
 */
export function useWibuRealtime({
  WIBU_REALTIME_TOKEN,
  project,
  url = "https://zyjixsbusgbbtvjogjho.supabase.co/"
}: UseClientRealtimeProps) {
  const supabaseRef = useRef<SupabaseClient | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const [currentData, setCurrentData] = useState<any | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initializeRealtime = async () => {
      try {
        const supabase = createClient(url, WIBU_REALTIME_TOKEN);
        supabaseRef.current = supabase;

        const channel = supabase
          .channel(project)
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: project },
            (payload: any) => {
              const data = payload.new?.data ?? null;
              if (isMounted) {
                setCurrentData(data);
              }
            }
          )
          .subscribe();

        channelRef.current = channel;
      } catch (error) {
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

  async function upsertData(val: Record<string, any>) {
    const supabase = supabaseRef.current;
    if (!supabase) {
      console.error("database client not initialized");
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
      } else {
        return {
          status,
          val
        };
      }
    } catch (error) {
      console.error("Error performing upsert:", error);
      return null;
    }
  }

  return [currentData, upsertData] as const;
}