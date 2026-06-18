import { unstable_noStore as noStore } from "next/cache";
import { getSupabaseAdmin } from "./supabaseAdmin";
import { defaultCards } from "./defaultCards";
import type { CardInput, PredictionCard } from "./types";

const TABLE = "prediction_cards";

function normalizeCard(row: any): PredictionCard {
  return {
    id: String(row.id),
    day_label: row.day_label || "",
    title: row.title || "",
    description: row.description || "Formulaire de la journée",
    matches: Array.isArray(row.matches) ? row.matches.filter(Boolean) : [],
    closing_text: row.closing_text || "",
    button_url: row.button_url || "#",
    visible: Boolean(row.visible),
    sort_order: Number(row.sort_order || 0),
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

function supabaseRequired() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    throw new Error("Supabase n'est pas configuré. Ajoutez SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans Vercel.");
  }
  return supabase;
}

export async function getVisibleCards(): Promise<PredictionCard[]> {
  noStore();
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return defaultCards;
  }

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("visible", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Erreur Supabase getVisibleCards:", error.message);
    return [];
  }

  return (data || []).map(normalizeCard);
}

export async function getAllCards(): Promise<PredictionCard[]> {
  noStore();
  const supabase = supabaseRequired();

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map(normalizeCard);
}

export async function createCard(input: CardInput): Promise<PredictionCard> {
  const supabase = supabaseRequired();

  const { data, error } = await supabase
    .from(TABLE)
    .insert(input)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return normalizeCard(data);
}

export async function updateCard(id: string, input: Partial<CardInput>): Promise<PredictionCard> {
  const supabase = supabaseRequired();

  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return normalizeCard(data);
}

export async function deleteCard(id: string): Promise<void> {
  const supabase = supabaseRequired();

  const { error } = await supabase.from(TABLE).delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
