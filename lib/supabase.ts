import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const supabase = url && key ? createClient(url, key) : null;

export type Need = {
  id: string;
  title: string;
  description: string;
  urgency: "normal" | "medium" | "high";
  region: string | null;
  status: string;
  visibility: string;
  created_at: string;
};

export type Claim = {
  id: string;
  statement: string;
  status: string;
  confidence: number | null;
  created_at: string;
};
