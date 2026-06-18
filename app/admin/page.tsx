import Image from "next/image";
import AdminPanel from "./AdminPanel";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <main className="admin-shell">
      <section className="admin-card">
        <div className="admin-top">
          <div>
            <div className="eyebrow">Espace privé</div>
            <h1>Gestion des journées</h1>
            <p>
              Ajoutez, modifiez, masquez ou supprimez les cards de pronostics. Seuls les champs utiles sont éditables : date, titre, matchs, clôture et lien du bouton.
            </p>
          </div>
          <Image className="admin-logo" src="/assets/logo-distri-concept.svg" alt="Distri Concept" width={220} height={120} priority />
        </div>
        <AdminPanel />
      </section>
    </main>
  );
}
