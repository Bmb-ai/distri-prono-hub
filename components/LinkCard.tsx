import type { HubLink } from '@/lib/types';
import { formatCloseDate, getStatusLabel, resolveStatus } from '@/lib/status';

export function LinkCard({ link, featured = false }: { link: HubLink; featured?: boolean }) {
  const status = resolveStatus(link);
  const closeLabel = formatCloseDate(link.closes_at);
  const isClosed = status === 'closed';

  return (
    <article className={`linkCard ${featured ? 'featuredCard' : ''} status-${status}`}>
      <div className="linkTopline">
        <span className="dayPill">{link.day_label || 'Pronostics'}</span>
        <span className="statusPill">{getStatusLabel(status)}</span>
      </div>

      <h3>{link.title}</h3>
      {link.subtitle ? <p className="cardText">{link.subtitle}</p> : null}

      {link.matches?.length ? (
        <div className="matchList" aria-label="Matchs de la journée">
          {link.matches.map((match) => (
            <span key={match}>{match}</span>
          ))}
        </div>
      ) : null}

      {closeLabel ? <p className="closeInfo">Clôture : {closeLabel}</p> : null}

      <a className={`mainLink ${isClosed ? 'closedLink' : ''}`} href={link.url} target="_blank" rel="noreferrer">
        {isClosed ? 'Voir le formulaire clôturé' : featured ? 'Participer maintenant' : 'Ouvrir le lien'}
      </a>
    </article>
  );
}
