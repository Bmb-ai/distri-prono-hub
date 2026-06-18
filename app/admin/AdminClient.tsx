'use client';

import { useMemo, useState } from 'react';
import type { HubLink, LinkStatus } from '@/lib/types';

type FormState = {
  id?: string;
  title: string;
  subtitle: string;
  day_label: string;
  url: string;
  status: LinkStatus;
  closes_at: string;
  matchesText: string;
  is_active: boolean;
  is_primary: boolean;
  sort_order: number;
};

const emptyForm: FormState = {
  title: '',
  subtitle: '',
  day_label: '',
  url: '',
  status: 'coming',
  closes_at: '',
  matchesText: '',
  is_active: true,
  is_primary: false,
  sort_order: 10
};

function fromLink(link: HubLink): FormState {
  return {
    id: link.id,
    title: link.title,
    subtitle: link.subtitle || '',
    day_label: link.day_label || '',
    url: link.url,
    status: link.status,
    closes_at: link.closes_at ? link.closes_at.slice(0, 16) : '',
    matchesText: link.matches?.join('\n') || '',
    is_active: link.is_active,
    is_primary: link.is_primary,
    sort_order: link.sort_order ?? 10
  };
}

function toPayload(form: FormState) {
  return {
    id: form.id,
    title: form.title,
    subtitle: form.subtitle,
    day_label: form.day_label,
    url: form.url,
    status: form.status,
    closes_at: form.closes_at ? new Date(form.closes_at).toISOString() : null,
    matches: form.matchesText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean),
    is_active: form.is_active,
    is_primary: form.is_primary,
    sort_order: Number(form.sort_order)
  };
}

function parseCsvLine(line: string) {
  const result: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === ',' && !insideQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result.map((value) => value.replace(/^"|"$/g, ''));
}

export function AdminClient() {
  const [password, setPassword] = useState('');
  const [isLogged, setIsLogged] = useState(false);
  const [links, setLinks] = useState<HubLink[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [csv, setCsv] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const sortedLinks = useMemo(
    () => [...links].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [links]
  );

  async function requestAdmin(path: string, options: RequestInit = {}) {
    const res = await fetch(path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': password,
        ...(options.headers || {})
      }
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Erreur inconnue');
    return json;
  }

  async function loadLinks() {
    setLoading(true);
    setMessage('');
    try {
      const json = await requestAdmin('/api/admin/links');
      setLinks(json.links || []);
      setIsLogged(true);
      setMessage('Connecté. Les liens sont chargés.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Erreur de connexion.');
    } finally {
      setLoading(false);
    }
  }

  async function saveLink() {
    setLoading(true);
    setMessage('');
    try {
      const payload = toPayload(form);
      const method = form.id ? 'PUT' : 'POST';
      await requestAdmin('/api/admin/links', {
        method,
        body: JSON.stringify(payload)
      });
      setForm(emptyForm);
      await loadLinks();
      setMessage('Lien enregistré.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Impossible d’enregistrer.');
    } finally {
      setLoading(false);
    }
  }

  async function deleteLink(id: string) {
    if (!confirm('Supprimer ce lien ?')) return;
    setLoading(true);
    setMessage('');
    try {
      await requestAdmin(`/api/admin/links?id=${id}`, { method: 'DELETE' });
      await loadLinks();
      setMessage('Lien supprimé.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Impossible de supprimer.');
    } finally {
      setLoading(false);
    }
  }

  async function duplicateLink(link: HubLink) {
    const duplicate = fromLink(link);
    duplicate.id = undefined;
    duplicate.title = `${duplicate.title} - copie`;
    duplicate.sort_order = Number(duplicate.sort_order) + 1;
    setForm(duplicate);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function importCsv() {
    const rows = csv.split('\n').map((row) => row.trim()).filter(Boolean);
    if (rows.length < 2) {
      setMessage('Colle au moins une ligne d’en-tête et une ligne de données.');
      return;
    }

    const headers = parseCsvLine(rows[0]);
    const items = rows.slice(1).map((row) => {
      const values = parseCsvLine(row);
      const record: Record<string, string> = {};
      headers.forEach((header, index) => {
        record[header] = values[index] || '';
      });

      return {
        title: record.title || record.titre || '',
        subtitle: record.subtitle || record.sous_titre || '',
        day_label: record.day_label || record.jour || '',
        url: record.url || record.lien || '',
        status: (record.status || 'coming') as LinkStatus,
        closes_at: record.closes_at ? new Date(record.closes_at).toISOString() : null,
        matches: (record.matches || record.matchs || '').split('|').map((m) => m.trim()).filter(Boolean),
        is_active: record.is_active !== 'false',
        is_primary: record.is_primary === 'true',
        sort_order: Number(record.sort_order || 10)
      };
    });

    setLoading(true);
    try {
      for (const item of items) {
        if (item.title && item.url) {
          await requestAdmin('/api/admin/links', {
            method: 'POST',
            body: JSON.stringify(item)
          });
        }
      }
      setCsv('');
      await loadLinks();
      setMessage('Import terminé.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Erreur pendant l’import.');
    } finally {
      setLoading(false);
    }
  }

  if (!isLogged) {
    return (
      <main className="adminShell">
        <section className="loginCard">
          <img src="/logo-distri-concept.svg" alt="Distri Concept" className="adminLogo" />
          <p className="eyebrow">Espace privé</p>
          <h1>Administration des liens</h1>
          <p>Entrez le mot de passe configuré dans Vercel pour modifier les journées, liens Tally, classement et règlement.</p>
          <input
            type="password"
            placeholder="Mot de passe admin"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') loadLinks();
            }}
          />
          <button className="adminPrimary" onClick={loadLinks} disabled={loading || !password}>
            {loading ? 'Connexion...' : 'Entrer'}
          </button>
          {message ? <p className="adminMessage">{message}</p> : null}
        </section>
      </main>
    );
  }

  return (
    <main className="adminPage">
      <header className="adminHeader">
        <div>
          <p className="eyebrow">Espace privé</p>
          <h1>Gestion des liens du concours</h1>
          <p>Ajoutez, cachez ou modifiez les boutons visibles sur la page d’accueil.</p>
        </div>
        <a href="/" className="adminGhost">Voir le site</a>
      </header>

      {message ? <div className="adminToast">{message}</div> : null}

      <section className="adminGrid">
        <form className="editorCard" onSubmit={(event) => { event.preventDefault(); saveLink(); }}>
          <h2>{form.id ? 'Modifier un lien' : 'Ajouter un lien'}</h2>
          <label>Titre du bouton<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Pronostics du mercredi 24 juin" /></label>
          <label>Sous-titre<input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder="Formulaire Tally de la journée" /></label>
          <label>Jour / catégorie<input value={form.day_label} onChange={(e) => setForm({ ...form, day_label: e.target.value })} placeholder="Mercredi 24 juin" /></label>
          <label>Lien<input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://tally.so/r/..." /></label>
          <div className="twoCols">
            <label>Statut
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as LinkStatus })}>
                <option value="open">Ouvert</option>
                <option value="coming">À venir</option>
                <option value="closed">Clôturé</option>
              </select>
            </label>
            <label>Ordre<input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} /></label>
          </div>
          <label>Clôture automatique affichée<input type="datetime-local" value={form.closes_at} onChange={(e) => setForm({ ...form, closes_at: e.target.value })} /></label>
          <label>Matchs du jour, un par ligne<textarea value={form.matchesText} onChange={(e) => setForm({ ...form, matchesText: e.target.value })} placeholder={'Portugal - Ouzbékistan\nAngleterre - Ghana'} /></label>

          <div className="checks">
            <label><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Visible sur le site</label>
            <label><input type="checkbox" checked={form.is_primary} onChange={(e) => setForm({ ...form, is_primary: e.target.checked })} /> Lien principal du moment</label>
          </div>

          <div className="editorActions">
            <button type="submit" className="adminPrimary" disabled={loading}>{form.id ? 'Enregistrer' : 'Ajouter'}</button>
            <button type="button" className="adminGhost" onClick={() => setForm(emptyForm)}>Réinitialiser</button>
          </div>
        </form>

        <section className="editorCard">
          <h2>Import rapide CSV</h2>
          <p className="hint">Colonnes acceptées : title, subtitle, day_label, url, status, closes_at, matches, sort_order. Sépare les matchs avec le symbole |.</p>
          <textarea className="csvArea" value={csv} onChange={(e) => setCsv(e.target.value)} placeholder={'title,subtitle,day_label,url,status,closes_at,matches,sort_order\nPronostics mardi,Formulaire Tally,Mardi 23 juin,https://tally.so/r/xxx,open,2026-06-23T18:45:00+02:00,Portugal - Ouzbékistan | Angleterre - Ghana,1'} />
          <button className="adminPrimary" onClick={importCsv} disabled={loading}>Importer</button>
        </section>
      </section>

      <section className="linksManager">
        <h2>Liens existants</h2>
        <div className="adminList">
          {sortedLinks.map((link) => (
            <article key={link.id} className={`adminItem ${link.is_active ? '' : 'mutedItem'}`}>
              <div>
                <span className="dayPill">{link.day_label || link.status}</span>
                {link.is_primary ? <span className="primaryMini">Lien principal</span> : null}
                {!link.is_active ? <span className="hiddenMini">Masqué</span> : null}
                <h3>{link.title}</h3>
                <p>{link.url}</p>
                {link.matches?.length ? <small>{link.matches.join(' • ')}</small> : null}
              </div>
              <div className="adminItemActions">
                <button onClick={() => setForm(fromLink(link))}>Modifier</button>
                <button onClick={() => duplicateLink(link)}>Dupliquer</button>
                <button className="dangerButton" onClick={() => deleteLink(link.id)}>Supprimer</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
