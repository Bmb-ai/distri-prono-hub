import { NextResponse } from 'next/server';
import { hasSupabaseConfig, getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    if (!hasSupabaseConfig()) {
      return NextResponse.json(
        { links: [], source: 'no-config' },
        { headers: { 'Cache-Control': 'no-store, max-age=0' } }
      );
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('hub_links')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) throw error;

    return NextResponse.json(
      { links: data ?? [], source: 'supabase' },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { links: [], source: 'error', error: 'Impossible de charger les liens.' },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  }
}
