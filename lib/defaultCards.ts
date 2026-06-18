import type { PredictionCard } from "./types";

export const defaultCards: PredictionCard[] = [
  {
    id: "demo-mardi",
    day_label: "Mardi 23 juin",
    title: "Pronostics du mardi 23 juin",
    description: "Formulaire de la journée",
    matches: ["Portugal - Ouzbékistan", "Angleterre - Ghana", "Colombie - RD Congo", "Panama - Croatie"],
    closing_text: "Clôture : mardi 23 juin à 18h45",
    button_url: "#",
    visible: true,
    sort_order: 1
  },
  {
    id: "demo-mercredi",
    day_label: "Mercredi 24 juin",
    title: "Pronostics du mercredi 24 juin",
    description: "Formulaire de la journée",
    matches: ["Suisse - Canada", "Bosnie-Herzégovine - Qatar", "Écosse - Brésil", "Maroc - Haïti"],
    closing_text: "Clôture : mercredi 24 juin à 20h45",
    button_url: "#",
    visible: true,
    sort_order: 2
  },
  {
    id: "demo-vendredi",
    day_label: "Vendredi 26 juin",
    title: "Pronostics du vendredi 26 juin",
    description: "Formulaire de la journée",
    matches: ["Norvège - France", "Sénégal - Irak", "Uruguay - Espagne", "Cap-Vert - Arabie Saoudite"],
    closing_text: "Clôture : vendredi 26 juin à 20h45",
    button_url: "#",
    visible: true,
    sort_order: 3
  }
];
