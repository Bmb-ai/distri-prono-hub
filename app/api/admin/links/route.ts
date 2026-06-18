import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth';
import { hasSupabaseConfig, getSupabaseAdmin } from '@/lib/supabaseAdmin';
import type { HubLinkInput } from '@/lib/types';

export const dynamic = 'force-dynamic';

function unauthorized() {
  return NextResponse.json({ error: 'Mot de passe admin incorrect.' }, { status: 401 });
}

function missingConfig() {
  return NextResponse.json(
    { error: 'Supabase n’est pas configuré. Ajoute SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans Vercel.' },
    { status: 500 }
  );
}

function normalizePayload(payload: Partial<HubLinkInput>) {
  return {
    title: String(payload.title ?? '').trim(),
    subtitle: String(payload.subtitle ?? '').trim(),
    day_label: String(payload.day_label ?? '').trim(),
    url: String(payload.url ?? '').trim(),
    status: payload.status ?? 'coming',
    closes_at: payload.closes_at || null,
    matches: Array.isArray(payload.matches) ? payload.matches.filter(Boolean) : [],
    is_active: Boolean(payload.is_active),
    is_primary: Boolean(payload.is_primary),
    sort_order: Number(payload.sort_order ?? 100)
  };
}

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();
  if (!hasSupabaseConfig()) return missingConfig();

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('hub_links')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ links: data ?? [] });
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();
  if (!hasSupabaseConfig()) return missingConfig();

  const payload = await request.json();
  const normalized = normalizePayload(payload);

  if (!normalized.title || !normalized.url) {
    return NextResponse.json({ error: 'Le titre et le lien sont obligatoires.' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('hub_links').insert(normalized).select('*').single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ link: data });
}

export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();
  if (!hasSupabaseConfig()) return missingConfig();

  const payload = await request.json();
  const id = payload.id;
  if (!id) return NextResponse.json({ error: 'ID manquant.' }, { status: 400 });

  const normalized = normalizePayload(payload);
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('hub_links')
    .update({ ...normalized, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ link: data });
}

export async function DELETE(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();
  if (!hasSupabaseConfig()) return missingConfig();

  const id = request.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID manquant.' }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('hub_links').delete().eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
