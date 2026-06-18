import { LinkCard } from '@/components/LinkCard';
import { LogoSecret } from '@/components/LogoSecret';
import { SecretAdminTrigger } from '@/components/SecretAdminTrigger';
import { defaultLinks } from '@/lib/defaultLinks';
import type { HubLink } from '@/lib/types';

export const dynamic = 'force-dynamic';

async function getLinks(): Promise<HubLink[]> {
  try {
    const { hasSupabaseConfig, getSupabaseAdmin } = await import('@/lib/supabaseAdmin');
    if (!hasSupabaseConfig()) return defaultLinks;

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('hub_links')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data ?? []) as HubLink[];
  } catch {
    return defaultLinks;
  }
}

export default async function HomePage() {
  const links = await getLinks();
  const primary = links.find((link) => link.is_primary) ?? links[0];
  const otherLinks = links.filter((link) => link.id !== primary?.id);

  return (
    <main className="pageShell">
      <SecretAdminTrigger />
      <section className="heroSection">
        <div className="heroGlow" />
        <div className="heroContent">
          <header className="topBar">
            <LogoSecret />
            <span className="freePill">Participation gratuite</span>
          </header>

          <div className="heroGrid">
            <div className="heroCopy">
              <p className="eyebrow">Concours de pronostics</p>
              <h1>Grand jeu pronostics football 2026</h1>
              <p className="lead">
                Pronostiquez les matchs du jour, cumulez des points et tentez de remporter un jeu de boules.
              </p>

              <div className="rulesGrid">
                <div><strong>5 pts</strong><span>score exact</span></div>
                <div><strong>3 pts</strong><span>bon résultat</span></div>
                <div><strong>0 pt</strong><span>sinon</span></div>
              </div>
            </div>

            <div className="prizeVisual">
              <img src="/lot-banner.png" alt="Lot à gagner : jeu de boules" />
            </div>
          </div>
        </div>
      </section>

      <section className="contentWrap">
        {primary ? (
          <div className="primaryArea">
            <div className="sectionTitle">
              <span>Formulaire à utiliser</span>
              <h2>Pronostics actuellement ouverts</h2>
            </div>
            <LinkCard link={primary} featured />
          </div>
        ) : null}

        {otherLinks.length ? (
          <div className="linksArea">
            <div className="sectionTitle">
              <span>Liens utiles</span>
              <h2>Journées, classement et règlement</h2>
            </div>
            <div className="cardsGrid">
              {otherLinks.map((link) => (
                <LinkCard key={link.id} link={link} />
              ))}
            </div>
          </div>
        ) : null}

        <section className="infoPanel">
          <h2>Comment ça marche ?</h2>
          <div className="steps">
            <p><strong>1.</strong> Choisissez la journée de pronostics encore ouverte.</p>
            <p><strong>2.</strong> Remplissez le formulaire Tally avec vos scores.</p>
            <p><strong>3.</strong> Utilisez toujours la même adresse e-mail pour cumuler vos points.</p>
            <p><strong>4.</strong> Le classement est mis à jour après vérification des résultats.</p>
          </div>
        </section>

        <footer className="footerLegal">
          Jeu gratuit sans obligation d’achat. Ce jeu n’est ni sponsorisé, ni administré, ni associé à la FIFA, à Instagram ou à Obut.
        </footer>
      </section>
    </main>
  );
}
