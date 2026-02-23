import { useEffect, useMemo, useState } from "react";
import "./Champions.css";

import ChampionModal from "../components/ChampionModal";
import ChampionCompareModal from "../components/ChampionCompareModal";

const ROLES = ["All", "Fighter", "Mage", "Tank", "Assassin", "Support", "Marksman"];

export default function Champions() {
  const [champions, setChampions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [role, setRole] = useState("All");

  // Modal detalle (habilidades)
  const [openId, setOpenId] = useState(null);

  // Compare
  const [compareIds, setCompareIds] = useState([]);     // ids seleccionados (max 2)
  const [compareOpen, setCompareOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("http://localhost:3001/api/champions");
        const data = await res.json();

        if (!res.ok || !data.ok) throw new Error(data?.error || "No se pudieron cargar los campeones");
        if (!cancelled) setChampions(data.champions || []);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return champions
      .filter((c) => (q ? c.name.toLowerCase().includes(q) : true))
      .filter((c) => (role === "All" ? true : (c.tags || []).includes(role)))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [champions, query, role]);

  function toggleCompare(id) {
    setCompareIds((prev) => {
      const exists = prev.includes(id);
      if (exists) return prev.filter((x) => x !== id);

      // si ya hay 2, reemplazamos el primero (más natural que bloquear)
      if (prev.length >= 2) return [prev[1], id];

      return [...prev, id];
    });
  }

  function clearCompare() {
    setCompareIds([]);
    setCompareOpen(false);
  }

  return (
    <main className="champions-page">
      <header className="champions-header">
        <h1 id="tittleChampionPage">Campeones</h1>
        <p className="champions-subtitle">
          Haz click para ver el kit. Selecciona 2 para comparar stats.
        </p>
      </header>

      <section className="champions-controls">
        <input
          className="champions-search"
          type="search"
          placeholder="Buscar campeón (ej. Ahri)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select className="champions-select" value={role} onChange={(e) => setRole(e.target.value)}>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r === "All" ? "Todos los roles" : r}
            </option>
          ))}
        </select>

        <div className="champions-count">
          Mostrando <strong>{filtered.length}</strong> de <strong>{champions.length}</strong>
        </div>
      </section>

      {loading && <div className="champions-loading">Cargando campeones...</div>}

      {!loading && error && (
        <div className="champions-error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {!loading && !error && (
        <section className="champions-grid">
          {filtered.map((c) => {
            const selected = compareIds.includes(c.id);

            return (
              <article className={`champion-card ${selected ? "is-selected" : ""}`} key={c.id}>
                {/* click en el cuerpo = abrir kit */}
                <div
                  className="champion-main"
                  role="button"
                  tabIndex={0}
                  onClick={() => setOpenId(c.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setOpenId(c.id);
                  }}
                  title="Ver habilidades"
                >
                  <img className="champion-icon" src={c.iconUrl} alt={c.name} />
                  <div className="champion-info">
                    <div className="champion-name">{c.name}</div>
                    <div className="champion-title">{c.title}</div>
                    <div className="champion-tags">
                      {(c.tags || []).slice(0, 2).map((t) => (
                        <span className="tag" key={t}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* botón comparar */}
                <button
                  className={`compare-btn ${selected ? "is-on" : ""}`}
                  type="button"
                  onClick={() => toggleCompare(c.id)}
                >
                  {selected ? "✓ En comparación" : "Comparar"}
                </button>
              </article>
            );
          })}
        </section>
      )}

      {/* Barra flotante de comparar */}
      {compareIds.length > 0 && (
        <div className="compare-bar">
          <div className="compare-bar-left">
            Seleccionados: <strong>{compareIds.length}</strong>/2
          </div>

          <div className="compare-bar-actions">
            <button className="compare-bar-btn ghost" type="button" onClick={clearCompare}>
              Limpiar
            </button>

            <button
              className="compare-bar-btn"
              type="button"
              disabled={compareIds.length !== 2}
              onClick={() => setCompareOpen(true)}
              title={compareIds.length !== 2 ? "Selecciona 2 campeones" : "Comparar"}
            >
              Comparar
            </button>
          </div>
        </div>
      )}

      {/* Modal kit */}
      <ChampionModal openId={openId} onClose={() => setOpenId(null)} />

      {/* Modal compare */}
      {compareOpen && (
        <ChampionCompareModal
          ids={compareIds}
          onClose={() => setCompareOpen(false)}
        />
      )}
    </main>
  );
}