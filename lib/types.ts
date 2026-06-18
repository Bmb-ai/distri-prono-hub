export type PredictionCard = {
  id: string;
  day_label: string;
  title: string;
  description: string;
  matches: string[];
  closing_text: string;
  button_url: string;
  visible: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

export type CardInput = Omit<PredictionCard, "id" | "created_at" | "updated_at">;
