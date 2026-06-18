-- Table utilisée par le mini-site pour afficher les liens Tally, classement et règlement.
-- À coller dans Supabase > SQL Editor > Run.

create extension if not exists pgcrypto;

create table if not exists public.hub_links (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text default '',
  day_label text default '',
  url text not null,
  status text not null default 'coming' check (status in ('open', 'coming', 'closed')),
  closes_at timestamptz,
  matches jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  is_primary boolean not null default false,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.hub_links enable row level security;

-- Lecture publique uniquement des liens visibles.
drop policy if exists "Public can read active hub links" on public.hub_links;
create policy "Public can read active hub links"
on public.hub_links
for select
using (is_active = true);

-- Aucune policy d'écriture publique : l'admin utilise la service role key côté serveur.

insert into public.hub_links (title, subtitle, day_label, url, status, closes_at, matches, is_active, is_primary, sort_order)
values
  (
    'Pronostics du mardi 23 juin',
    'Formulaire Tally de la journée',
    'Mardi 23 juin',
    'https://tally.so/r/LIEN_MARDI',
    'coming',
    '2026-06-23T18:45:00+02:00',
    '["Portugal - Ouzbékistan", "Angleterre - Ghana"]'::jsonb,
    true,
    true,
    1
  ),
  (
    'Voir le classement',
    'Classement général mis à jour après validation des scores',
    'Classement',
    'https://docs.google.com/spreadsheets/d/VOTRE_CLASSEMENT',
    'open',
    null,
    '[]'::jsonb,
    true,
    false,
    90
  ),
  (
    'Consulter le règlement',
    'Conditions de participation et barème du concours',
    'Règlement',
    'https://drive.google.com/VOTRE_REGLEMENT',
    'open',
    null,
    '[]'::jsonb,
    true,
    false,
    100
  )
on conflict do nothing;
