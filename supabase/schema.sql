-- Table utilisée uniquement pour afficher les cards de liens Tally sur le site.
-- Les pronostics restent gérés dans Tally et Google Sheets.

create extension if not exists "pgcrypto";

create table if not exists public.prediction_cards (
  id uuid primary key default gen_random_uuid(),
  day_label text not null,
  title text not null,
  description text not null default 'Formulaire de la journée',
  matches text[] not null default '{}',
  closing_text text not null,
  button_url text not null,
  visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists prediction_cards_visible_sort_idx
  on public.prediction_cards (visible, sort_order, created_at);

alter table public.prediction_cards enable row level security;

-- Aucune policy publique n'est nécessaire : le site lit/écrit côté serveur avec SUPABASE_SERVICE_ROLE_KEY.

insert into public.prediction_cards (day_label, title, description, matches, closing_text, button_url, visible, sort_order)
values
  (
    'Mardi 23 juin',
    'Pronostics du mardi 23 juin',
    'Formulaire de la journée',
    array['Portugal - Ouzbékistan', 'Angleterre - Ghana', 'Colombie - RD Congo', 'Panama - Croatie'],
    'Clôture : mardi 23 juin à 18h45',
    'https://tally.so/r/LIEN_MARDI',
    true,
    1
  ),
  (
    'Mercredi 24 juin',
    'Pronostics du mercredi 24 juin',
    'Formulaire de la journée',
    array['Suisse - Canada', 'Bosnie-Herzégovine - Qatar', 'Écosse - Brésil', 'Maroc - Haïti'],
    'Clôture : mercredi 24 juin à 20h45',
    'https://tally.so/r/LIEN_MERCREDI',
    true,
    2
  ),
  (
    'Vendredi 26 juin',
    'Pronostics du vendredi 26 juin',
    'Formulaire de la journée',
    array['Norvège - France', 'Sénégal - Irak', 'Uruguay - Espagne', 'Cap-Vert - Arabie Saoudite'],
    'Clôture : vendredi 26 juin à 20h45',
    'https://tally.so/r/LIEN_VENDREDI',
    true,
    3
  )
on conflict do nothing;
