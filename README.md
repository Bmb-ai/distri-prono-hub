# Distri Concept - Hub pronostics Tally

Mini-site responsive hébergé sur Vercel qui sert de page centrale pour un jeu concours de pronostics.

Le site ne collecte pas les pronostics. Il affiche simplement des cards avec un bouton vers les formulaires Tally de chaque journée. L'espace admin permet d'ajouter, modifier, masquer ou supprimer les cards sans toucher au code.

## Fonctionnement

- Page publique : `/`
- Espace admin : `/admin`
- Base Supabase : table `prediction_cards`
- Couleur principale : `#fe862e`
- Bouton public fixe : `Participer maintenant`

## Champs modifiables depuis l'admin

- Date affichée dans la pastille, exemple : `Vendredi 26 juin`
- Titre de la card, exemple : `Pronostics du vendredi 26 juin`
- Description, par défaut : `Formulaire de la journée`
- Liste des matchs, un match par ligne
- Texte de clôture, exemple : `Clôture : vendredi 26 juin à 20h45`
- Lien du bouton Tally
- Visibilité de la card
- Ordre d'affichage

## Installation Supabase

1. Ouvrir Supabase.
2. Aller dans `SQL Editor`.
3. Copier le contenu de `supabase/schema.sql`.
4. Cliquer sur `Run`.
5. Vérifier que la table `prediction_cards` existe dans `Table Editor`.

## Variables Vercel

Dans Vercel, ajouter :

```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=ta_cle_service_role_ou_sb_secret
ADMIN_PASSWORD=ton_mot_de_passe_admin
```

La clé `SUPABASE_SERVICE_ROLE_KEY` doit rester privée. Ne jamais la mettre dans GitHub.

## Déploiement

1. Envoyer le projet sur GitHub.
2. Importer le repo dans Vercel.
3. Ajouter les variables d'environnement.
4. Déployer.
5. Aller sur `/admin` pour gérer les cards.

## Modifier le visuel

- Logo : `public/assets/logo-distri-concept.svg`
- Image du lot : `public/assets/lot-obut.png`
- Styles : `app/styles.css`
