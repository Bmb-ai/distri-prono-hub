# Distri Concept — Hub pronostics Tally

Mini-site responsive type Linktree, plus professionnel, pour héberger les liens Tally du jeu concours.

## Fonctionnement

- Page publique avec image du lot, logo Distri Concept et couleur principale `#fe862e`.
- Boutons vers les formulaires Tally par journée.
- Boutons vers le classement et le règlement.
- Espace admin caché pour ajouter, modifier, masquer ou supprimer les liens.
- Accès admin direct : `/admin`.
- Accès admin secret depuis la page d’accueil : taper `distri` au clavier ou cliquer 5 fois sur le logo.

## Installation rapide

### 1. Créer la table Supabase

Dans Supabase :

`SQL Editor` > coller le contenu de `supabase/schema.sql` > `Run`.

Cela crée la table `hub_links`.

### 2. Mettre le projet sur GitHub

Dézippez le projet, puis importez tous les fichiers dans un repository GitHub.

### 3. Déployer sur Vercel

Dans Vercel :

`Add New Project` > choisir le repository GitHub > importer.

Ajoutez les variables d’environnement suivantes :

```env
NEXT_PUBLIC_SITE_URL=https://votre-site.vercel.app
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_role_ou_sb_secret
ADMIN_PASSWORD=votre_mot_de_passe_admin
```

Important : `SUPABASE_SERVICE_ROLE_KEY` est une clé privée. Ne la mettez jamais dans GitHub et ne la partagez pas.

### 4. Premier déploiement

Cliquez sur `Deploy`.

Après le déploiement, récupérez l’URL finale Vercel, puis remplacez la variable `NEXT_PUBLIC_SITE_URL` par cette vraie URL. Redéployez ensuite.

## Utilisation admin

Allez sur :

```txt
https://votre-site.vercel.app/admin
```

Entrez le mot de passe défini dans `ADMIN_PASSWORD`.

Vous pourrez ensuite :

- ajouter un lien Tally ;
- modifier un lien ;
- masquer un lien sans le supprimer ;
- choisir le lien principal du moment ;
- supprimer un lien ;
- importer plusieurs journées en CSV.

## Format CSV d’import

Colonnes acceptées :

```csv
title,subtitle,day_label,url,status,closes_at,matches,sort_order
Pronostics mardi,Formulaire Tally,Mardi 23 juin,https://tally.so/r/xxx,open,2026-06-23T18:45:00+02:00,Portugal - Ouzbékistan | Angleterre - Ghana,1
```

Statuts possibles :

- `open` : ouvert ;
- `coming` : à venir ;
- `closed` : clôturé.

Les matchs doivent être séparés par le symbole `|`.

## Important

Ce site ne collecte pas les pronostics. Les pronostics restent gérés dans Tally et Google Sheets.

Le rôle du site est uniquement de centraliser les liens et d’éviter un Linktree générique.
