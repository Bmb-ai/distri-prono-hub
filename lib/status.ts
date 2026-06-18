import type { HubLink, LinkStatus } from './types';

export function resolveStatus(link: HubLink): LinkStatus {
  if (link.status === 'closed') return 'closed';
  if (!link.closes_at) return link.status;

  const closeTime = new Date(link.closes_at).getTime();
  if (Number.isNaN(closeTime)) return link.status;

  return Date.now() >= closeTime ? 'closed' : link.status;
}

export function getStatusLabel(status: LinkStatus) {
  switch (status) {
    case 'open':
      return 'Ouvert';
    case 'coming':
      return 'À venir';
    case 'closed':
      return 'Clôturé';
  }
}

export function formatCloseDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Paris'
  }).format(date);
}
