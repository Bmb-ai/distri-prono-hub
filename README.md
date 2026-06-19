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


## Réseaux sociaux ajoutés

La page publique contient désormais une section `Suivre le concours` avec les liens :

- Instagram : https://www.instagram.com/distri_concept69/
- Facebook : https://www.facebook.com/profile.php?id=61551920047655&locale=fr_FR

Cette modification ne touche pas à Supabase, aux cards de pronostics, ni à l’espace admin.


## Mise à jour réseaux sociaux

Les liens Instagram et Facebook sont intégrés directement dans le hero, sous le texte d’introduction, pour inciter les visiteurs à suivre Distri Concept sans ajouter une section séparée plus bas dans la page.


## Mise à jour footer et logo

Cette version remplace le logo par `LOGO DISTRI CONCEPT FUSION 2.4.svg`, ajoute une courte section de présentation de Distri Concept et Concept Solaire, puis ajoute un footer contact avec les agences de Brindas et Sain-Bel.

Cette modification ne change pas le schéma Supabase et n’impacte pas la table `prediction_cards`.

## Mise à jour réseaux discrets

Les boutons texte Instagram/Facebook du hero ont été remplacés par de petites icônes discrètes. Deux lignes sont affichées :

- Distri Concept : Instagram et Facebook
- Concept Solaire : Instagram et Facebook

Cette modification est uniquement visuelle. Elle ne touche pas à Supabase, aux cards Tally, à l'espace admin ni aux variables Vercel.
