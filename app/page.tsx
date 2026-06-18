import Image from "next/image";
import { getVisibleCards } from "@/lib/cards";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const cards = await getVisibleCards();

  return (
    <main className="page-shell">
      <section className="hero-card" aria-label="Présentation du jeu concours">
        <div className="hero-copy">
          <div className="eyebrow">Jeu concours gratuit</div>
          <h1>Grand jeu pronostics football 2026</h1>
          <div className="hero-text">
            <p>
              À l’occasion de la Coupe du monde 2026, participez à notre jeu concours de pronostics et tentez de remporter un jeu de boules Obut.
            </p>
            <p>
              Le principe est simple : pronostiquez les scores des matchs sélectionnés, validez votre grille avant la clôture, et marquez des points selon la précision de vos pronostics.
            </p>
            <p className="note">
              <em>Participation gratuite, sans obligation d’achat. Une seule participation par personne.</em>
            </p>
          </div>
        </div>

        <div className="hero-media" aria-label="Lot à gagner">
          <Image className="brand-logo" src="/assets/logo-distri-concept.svg" alt="Distri Concept" width={260} height={130} priority />
          <div className="prize-card">
            <Image src="/assets/lot-obut.png" alt="Jeu de boules Obut à gagner" width={900} height={1100} priority />
          </div>
        </div>
      </section>

      <section className="rules-strip" aria-label="Règles de points">
        <div className="rules-text">
          <div className="eyebrow">Règles du jeu</div>
          <h2>Comment marquer des points&nbsp;?</h2>
          <p>
            Pour chaque match, un score exact rapporte 5 points. Si le score exact n’est pas trouvé mais que le participant a trouvé la bonne issue du match, victoire, nul ou défaite, il marque 3 points. Un mauvais résultat rapporte 0 point.
          </p>
        </div>

        <div className="score-cards" aria-label="Barème">
          <article className="score-card exact">
            <strong>5 pts</strong>
            <span>Score exact</span>
          </article>
          <article className="score-card result">
            <strong>3 pts</strong>
            <span>Bonne issue</span>
          </article>
          <article className="score-card miss">
            <strong>0 pt</strong>
            <span>Mauvais résultat</span>
          </article>
        </div>
      </section>

      <section className="forms-section" aria-label="Formulaires de pronostics">
        <div className="section-title">
          <div className="eyebrow">Participer</div>
          <h2>Pronostics actuellement ouverts</h2>
          <p>
            Choisissez la journée souhaitée, consultez les matchs concernés, puis accédez au formulaire correspondant. Les formulaires peuvent être ajoutés, masqués ou remplacés depuis l’espace privé.
          </p>
        </div>

        <div className="day-list">
          {cards.length > 0 ? (
            cards.map((card) => (
              <article className="day-card" key={card.id}>
                <div className="day-card-header">
                  <span className="day-badge">{card.day_label}</span>
                </div>

                <div className="day-card-body">
                  <div>
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                  </div>

                  {card.matches.length > 0 && (
                    <div className="matches" aria-label="Matchs de la journée">
                      {card.matches.map((match) => (
                        <span key={match}>{match}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="day-card-footer">
                  <p className="closing">{card.closing_text}</p>
                  <a className="cta" href={card.button_url || "#"} aria-label={`Participer à ${card.title}`} target="_blank" rel="noreferrer">
                    Participer maintenant
                  </a>
                </div>
              </article>
            ))
          ) : (
            <article className="empty-card">
              <h3>Aucun formulaire disponible pour le moment</h3>
              <p>Les prochaines journées de pronostics seront ajoutées prochainement.</p>
            </article>
          )}
        </div>
      </section>

      <footer className="footer-note">
        Jeu organisé par Distri Concept. Non affilié à la FIFA, à Instagram ou à Obut.
      </footer>
    </main>
  );
}
