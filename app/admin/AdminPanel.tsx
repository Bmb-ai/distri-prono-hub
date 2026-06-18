"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { CardInput, PredictionCard } from "@/lib/types";

type FormState = {
  id?: string;
  day_label: string;
  title: string;
  description: string;
  matchesText: string;
  closing_text: string;
  button_url: string;
  visible: boolean;
  sort_order: number;
};

const emptyForm: FormState = {
  day_label: "",
  title: "",
  description: "Formulaire de la journée",
  matchesText: "",
  closing_text: "Clôture : ",
  button_url: "",
  visible: true,
  sort_order: 1
};

function toInput(form: FormState): CardInput {
  return {
    day_label: form.day_label.trim(),
    title: form.title.trim(),
    description: form.description.trim() || "Formulaire de la journée",
    matches: form.matchesText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
    closing_text: form.closing_text.trim(),
    button_url: form.button_url.trim(),
    visible: form.visible,
    sort_order: Number(form.sort_order || 0)
  };
}

function fromCard(card: PredictionCard): FormState {
  return {
    id: card.id,
    day_label: card.day_label,
    title: card.title,
    description: card.description || "Formulaire de la journée",
    matchesText: card.matches.join("\n"),
    closing_text: card.closing_text,
    button_url: card.button_url,
    visible: card.visible,
    sort_order: card.sort_order
  };
}

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [cards, setCards] = useState<PredictionCard[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const editing = useMemo(() => Boolean(form.id), [form.id]);

  async function request<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {})
      }
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(json?.error || "Une erreur est survenue.");
    }
    return json as T;
  }

  async function loadCards() {
    setError("");
    try {
      const data = await request<{ cards: PredictionCard[] }>("/api/admin/cards");
      setCards(data.cards);
      setIsLoggedIn(true);
    } catch (err) {
      setIsLoggedIn(false);
      if (err instanceof Error && !err.message.toLowerCase().includes("non autorisé")) {
        setError(err.message);
      }
    }
  }

  useEffect(() => {
    loadCards();
  }, []);

  async function login(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await request<{ ok: boolean }>("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ password })
      });
      setPassword("");
      setMessage("Connexion réussie.");
      await loadCards();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await request("/api/admin/logout", { method: "POST", body: JSON.stringify({}) }).catch(() => null);
    setIsLoggedIn(false);
    setCards([]);
  }

  async function saveCard(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    const payload = toInput(form);

    if (!payload.day_label || !payload.title || !payload.closing_text || !payload.button_url) {
      setError("Remplis au minimum la date, le titre, la clôture et le lien du bouton.");
      setLoading(false);
      return;
    }

    try {
      if (editing && form.id) {
        await request(`/api/admin/cards/${form.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload)
        });
        setMessage("Card modifiée.");
      } else {
        await request("/api/admin/cards", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        setMessage("Card ajoutée.");
      }
      setForm(emptyForm);
      await loadCards();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible d’enregistrer la card.");
    } finally {
      setLoading(false);
    }
  }

  async function removeCard(id: string) {
    if (!confirm("Supprimer cette card ?")) return;
    setError("");
    setMessage("");
    try {
      await request(`/api/admin/cards/${id}`, { method: "DELETE" });
      setMessage("Card supprimée.");
      if (form.id === id) setForm(emptyForm);
      await loadCards();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de supprimer la card.");
    }
  }

  async function toggleVisibility(card: PredictionCard) {
    setError("");
    setMessage("");
    try {
      await request(`/api/admin/cards/${card.id}`, {
        method: "PATCH",
        body: JSON.stringify({ visible: !card.visible })
      });
      setMessage(card.visible ? "Card masquée." : "Card affichée.");
      await loadCards();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de modifier la visibilité.");
    }
  }

  function duplicate(card: PredictionCard) {
    const next = fromCard(card);
    delete next.id;
    setForm({
      ...next,
      title: `${next.title} copie`,
      sort_order: Number(next.sort_order || 0) + 1
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!isLoggedIn) {
    return (
      <form onSubmit={login} className="login-inline">
        <div className="form-field full">
          <label htmlFor="admin-password">Mot de passe admin</label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Mot de passe configuré dans Vercel"
          />
        </div>
        <div className="form-actions">
          <button className="button-primary" type="submit" disabled={loading}>
            {loading ? "Connexion..." : "Entrer"}
          </button>
        </div>
        {error && <div className="feedback error">{error}</div>}
        {message && <div className="feedback">{message}</div>}
      </form>
    );
  }

  return (
    <div>
      <div className="form-actions" style={{ justifyContent: "flex-end", marginTop: 0 }}>
        <button className="button-secondary" type="button" onClick={logout}>Se déconnecter</button>
      </div>

      <form onSubmit={saveCard}>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="day_label">Date affichée dans la pastille</label>
            <input
              id="day_label"
              value={form.day_label}
              onChange={(event) => setForm({ ...form, day_label: event.target.value })}
              placeholder="Vendredi 26 juin"
            />
          </div>

          <div className="form-field">
            <label htmlFor="title">Titre de la card</label>
            <input
              id="title"
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              placeholder="Pronostics du vendredi 26 juin"
            />
          </div>

          <div className="form-field full">
            <label htmlFor="description">Description</label>
            <input
              id="description"
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              placeholder="Formulaire de la journée"
            />
          </div>

          <div className="form-field full">
            <label htmlFor="matches">Matchs affichés</label>
            <textarea
              id="matches"
              value={form.matchesText}
              onChange={(event) => setForm({ ...form, matchesText: event.target.value })}
              placeholder={"Norvège - France\nSénégal - Irak\nUruguay - Espagne"}
            />
            <div className="small-note">Écris un match par ligne. Ils seront affichés sous forme de petites pastilles.</div>
          </div>

          <div className="form-field">
            <label htmlFor="closing_text">Texte de clôture</label>
            <input
              id="closing_text"
              value={form.closing_text}
              onChange={(event) => setForm({ ...form, closing_text: event.target.value })}
              placeholder="Clôture : vendredi 26 juin à 20h45"
            />
          </div>

          <div className="form-field">
            <label htmlFor="button_url">Lien du bouton</label>
            <input
              id="button_url"
              value={form.button_url}
              onChange={(event) => setForm({ ...form, button_url: event.target.value })}
              placeholder="https://tally.so/r/..."
            />
          </div>

          <div className="form-field">
            <label htmlFor="sort_order">Ordre d’affichage</label>
            <input
              id="sort_order"
              type="number"
              value={form.sort_order}
              onChange={(event) => setForm({ ...form, sort_order: Number(event.target.value) })}
            />
          </div>

          <div className="form-field">
            <label>Affichage public</label>
            <label className="checkbox-line">
              <input
                type="checkbox"
                checked={form.visible}
                onChange={(event) => setForm({ ...form, visible: event.target.checked })}
              />
              Afficher cette card sur le site
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button className="button-primary" type="submit" disabled={loading}>
            {editing ? "Enregistrer les modifications" : "Ajouter la card"}
          </button>
          {editing && (
            <button className="button-secondary" type="button" onClick={() => setForm(emptyForm)}>
              Annuler la modification
            </button>
          )}
        </div>
      </form>

      {error && <div className="feedback error">{error}</div>}
      {message && <div className="feedback">{message}</div>}

      <div className="admin-separator" />

      <h2>Cards existantes</h2>
      <p className="small-note">Tu peux modifier, dupliquer, masquer ou supprimer chaque journée.</p>

      <div className="cards-admin-list">
        {cards.map((card) => (
          <article className="admin-list-card" key={card.id}>
            <div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 8 }}>
                <span className="status-pill">{card.day_label}</span>
                <span className={`status-pill ${card.visible ? "" : "hidden"}`}>{card.visible ? "Visible" : "Masqué"}</span>
              </div>
              <h3>{card.title}</h3>
              <p>{card.closing_text}</p>
              <div className="admin-mini-tags">
                {card.matches.slice(0, 6).map((match) => <span key={match}>{match}</span>)}
              </div>
            </div>

            <div className="admin-list-actions">
              <button className="button-secondary" type="button" onClick={() => { setForm(fromCard(card)); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                Modifier
              </button>
              <button className="button-secondary" type="button" onClick={() => duplicate(card)}>
                Dupliquer
              </button>
              <button className="button-secondary" type="button" onClick={() => toggleVisibility(card)}>
                {card.visible ? "Masquer" : "Afficher"}
              </button>
              <button className="button-danger" type="button" onClick={() => removeCard(card.id)}>
                Supprimer
              </button>
            </div>
          </article>
        ))}

        {cards.length === 0 && (
          <article className="empty-card">
            <h3>Aucune card enregistrée</h3>
            <p>Ajoute ta première journée avec le formulaire ci-dessus.</p>
          </article>
        )}
      </div>
    </div>
  );
}
