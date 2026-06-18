export type LinkStatus = 'open' | 'coming' | 'closed';

export type HubLink = {
  id: string;
  title: string;
  subtitle?: string | null;
  day_label?: string | null;
  url: string;
  status: LinkStatus;
  closes_at?: string | null;
  matches: string[];
  is_active: boolean;
  is_primary: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

export type HubLinkInput = Omit<HubLink, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
};
