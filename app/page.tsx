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
          <h1>Grand jeu pronostics Coupe du monde 2026</h1>
          <div className="hero-text">
            <p>
              À l’occasion de la Coupe du monde 2026, participez à notre jeu concours de pronostics et tentez de remporter l’un des deux jeux de boules Obut mis en jeu.
            </p>
            <p>
              Le principe est simple : pronostiquez les scores des matchs sélectionnés, validez votre grille avant la clôture, et marquez des points selon la précision de vos pronostics.
            </p>
            <p className="note">
              <em>Participation gratuite, sans obligation d’achat. Une seule participation par personne.</em>
            </p>

            <div className="hero-social" aria-label="Réseaux sociaux Distri Concept et Concept Solaire">
              <p>
                Suivez-nous pour découvrir les résultats, les rappels des prochaines journées de pronostics et l’annonce du gagnant.
              </p>

              <div className="social-mini-list">
                <div className="social-mini-row">
                  <span>Distri Concept</span>
                  <div className="social-icon-links" aria-label="Réseaux sociaux Distri Concept">
                    <a href="https://www.instagram.com/distri_concept69/" target="_blank" rel="noreferrer" aria-label="Instagram Distri Concept">
                      <InstagramIcon />
                    </a>
                    <a href="https://www.facebook.com/profile.php?id=61551920047655&locale=fr_FR" target="_blank" rel="noreferrer" aria-label="Facebook Distri Concept">
                      <FacebookIcon />
                    </a>
                  </div>
                </div>

                <div className="social-mini-row">
                  <span>Concept Solaire</span>
                  <div className="social-icon-links" aria-label="Réseaux sociaux Concept Solaire">
                    <a href="https://www.instagram.com/conceptsolaire69/" target="_blank" rel="noreferrer" aria-label="Instagram Concept Solaire">
                      <InstagramIcon />
                    </a>
                    <a href="https://www.facebook.com/profile.php?id=61569903031500&locale=fr_FR" target="_blank" rel="noreferrer" aria-label="Facebook Concept Solaire">
                      <FacebookIcon />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-media" aria-label="Lot à gagner">
          <Image className="brand-logo" src="/assets/logo-distri-concept.svg" alt="Distri Concept" width={260} height={130} priority />
          <div className="prize-card">
            <Image src="/assets/lot-obut.png" alt="Jeu de boules Obut à gagner" width={900} height={1100} priority />
          </div>
        </div>
      </section>

      <section className="contest-phases" aria-label="Deux temps du concours">
        <div className="section-title compact">
          <div className="eyebrow">Deux chances de gagner</div>
          <h2>Deux jeux de boules à remporter</h2>
          <p>
            La première partie du jeu démarre le mardi 23 juin et concerne les derniers matchs de la phase de poules. Un premier gagnant sera désigné à la fin de cette période. Une seconde partie sera ensuite organisée pour les 16es de finale, avec un nouveau classement et un second jeu de boules à gagner.
          </p>
        </div>

        <div className="phase-grid">
          <article className="phase-card">
            <span>1</span>
            <div>
              <h3>Derniers matchs de poules</h3>
              <p>Un premier classement sera établi avec les pronostics ouverts à partir du mardi 23 juin.</p>
            </div>
          </article>

          <article className="phase-card">
            <span>2</span>
            <div>
              <h3>16es de finale</h3>
              <p>Une nouvelle série de pronostics permettra de désigner un second gagnant.</p>
            </div>
          </article>
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


      <section className="about-section" aria-label="À propos de Distri Concept et Concept Solaire">
        <div className="section-title compact">
          <div className="eyebrow">À propos</div>
          <h2>Distri Concept et Concept Solaire</h2>
          <p>Deux activités complémentaires pour accompagner les projets du quotidien, de l’équipement technique aux solutions solaires.</p>
        </div>

        <div className="brand-panels">
          <article className="brand-panel">
            <div className="brand-panel-header">
              <Image src="/assets/distri-concept-logo.png" alt="Logo Distri Concept" width={220} height={160} />
              <h3>Distri Concept</h3>
            </div>
            <p>Distributeur local spécialisé dans les équipements techniques pour les particuliers et les professionnels, avec un accompagnement de proximité depuis les agences de Brindas et Sain-Bel.</p>
          </article>
          <article className="brand-panel solar">
            <div className="brand-panel-header">
              <Image src="/assets/concept-solaire-logo.png" alt="Logo Concept Solaire" width={220} height={160} />
              <h3>Concept Solaire</h3>
            </div>
            <p>Une expertise dédiée aux solutions solaires pour aider les clients à avancer vers des installations plus performantes, durables et adaptées à leurs besoins.</p>
          </article>
        </div>
      </section>

      <footer className="site-footer" aria-label="Contact Distri Concept">
        <div className="footer-heading">
          <div className="eyebrow">Contact</div>
          <h2>Nos agences</h2>
        </div>

        <div className="footer-contact-card">
          <div className="contact-office">
            <h3>Brindas</h3>
            <p><span>Adresse</span>37 rue Pré Magné, 69126 Brindas</p>
            <p><span>Téléphone</span><a href="tel:+33478442740">04 78 44 27 40</a></p>
            <p><span>Email</span><a href="mailto:contact@distri-concept.fr">contact@distri-concept.fr</a></p>
          </div>

          <div className="contact-office">
            <h3>Sain-Bel</h3>
            <p><span>Adresse</span>6 chemin Neuf, 69120 Sain-Bel</p>
            <p><span>Téléphone</span><a href="tel:+33487255402">04 87 25 54 02</a></p>
            <p><span>Email</span><a href="mailto:contactsb@distri-concept.fr">contactsb@distri-concept.fr</a></p>
          </div>
        </div>
      </footer>
    </main>
  );
}


function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="4.2" y="4.2" width="15.6" height="15.6" rx="4.5" />
      <circle cx="12" cy="12" r="3.4" />
      <circle cx="16.8" cy="7.2" r="1" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M14.2 8.2h2.2V4.6c-.4-.1-1.7-.2-3.1-.2-3.1 0-5.1 1.9-5.1 5.4v3H4.8v4h3.4v7h4.2v-7h3.3l.5-4h-3.8v-2.6c0-1.1.3-2 1.8-2Z" />
    </svg>
  );
}
