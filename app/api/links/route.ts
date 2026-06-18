import { NextResponse } from 'next/server';
import { defaultLinks } from '@/lib/defaultLinks';
import { hasSupabaseConfig, getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!hasSupabaseConfig()) {
      return NextResponse.json({ links: defaultLinks, source: 'fallback' });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('hub_links')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ links: data ?? [], source: 'supabase' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ links: defaultLinks, source: 'fallback', error: 'Impossible de charger Supabase. Mode démo actif.' });
  }
}
