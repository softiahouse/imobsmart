import { createBrowserClient } from "@supabase/ssr";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://povmcgwlrfhzdcavxqah.supabase.co";

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvdm1jZ3dscmZoemRjYXZ4cWFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2NDg4NjQsImV4cCI6MjA5ODIyNDg2NH0.AijytmUXKQOjZ2NZQhz4BUnVmJbOTNbdrB19Pcu38Cg";

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
