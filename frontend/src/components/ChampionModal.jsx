import { useEffect, useMemo, useRef, useState } from "react";
import "./ChampionModal.css";

export default function ChampionModal({ openId, onClose }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState("passive"); // passive | spells | stats
  const [isClosing, setIsClosing] = useState(false);

  const modalRef = useRef(null);
  const passiveRef = useRef(null);
  const spellsRef = useRef(null);
  const statsRef = useRef(null);

  // Para evitar que el scroll “pise” el tab cuando tú haces click en un botón
  const lockRef = useRef(false);

  const tabToRef = useMemo(
    () => ({
      passive: passiveRef,
      spells: spellsRef,
      stats: statsRef,
    }),
    []
  );

  function requestClose() {
    setIsClosing(true);
  }

  function onAnimationEnd(e) {
    if (e.target !== e.currentTarget) return;
    if (isClosing) {
      setIsClosing(false);
      onClose();
    }
  }

  // ESC
  useEffect(() => {
    if (!openId) return;

    function onKeyDown(e) {
      if (e.key === "Escape") requestClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openId]);

  // Bloquear scroll body
  useEffect(() => {
    if (!openId) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prev;
    };
  }, [openId]);

  // Cargar detalle
  useEffect(() => {
    if (!openId) return;

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");
        setDetail(null);
        setActiveTab("passive");

        const res = await fetch(`http://localhost:3001/api/champions/${openId}`);
        const data = await res.json();

        if (!res.ok || !data.ok) {
          throw new Error(data?.error || "No se pudo cargar el campeón");
        }

        if (!cancelled) setDetail(data.champion);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [openId]);

  // ✅ Tab activo por scroll (robusto)
  useEffect(() => {
    if (!detail) return;

    const container = modalRef.current;
    if (!container) return;

    const headerOffset = 76; // aprox altura del sticky (tabs+padding)
    let raf = null;

    const getTopDistance = (el) => {
      if (!el) return Number.POSITIVE_INFINITY;
      const cRect = container.getBoundingClientRect();
      const eRect = el.getBoundingClientRect();
      // distancia del top del elemento al top del contenedor, restando el header sticky
      return Math.abs((eRect.top - cRect.top) - headerOffset);
    };

    const computeActive = () => {
      if (lockRef.current) return;

      const dPassive = getTopDistance(passiveRef.current);
      const dSpells = getTopDistance(spellsRef.current);
      const dStats = getTopDistance(statsRef.current);

      // el menor = más cercano al top
      let next = "passive";
      let min = dPassive;

      if (dSpells < min) {
        min = dSpells;
        next = "spells";
      }
      if (dStats < min) {
        min = dStats;
        next = "stats";
      }

      // Evitamos renders innecesarios
      setActiveTab((prev) => (prev === next ? prev : next));
    };

    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(computeActive);
    };

    container.addEventListener("scroll", onScroll, { passive: true });

    // Primera medición
    computeActive();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      container.removeEventListener("scroll", onScroll);
    };
  }, [detail]);

  function goTo(tab) {
    setActiveTab(tab);

    const target = tabToRef[tab]?.current;
    const container = modalRef.current;
    if (!target || !container) return;

    // Bloqueamos el auto-tab mientras dura el scroll suave
    lockRef.current = true;

    target.scrollIntoView({ behavior: "smooth", block: "start" });

    // Liberar lock tras un breve tiempo (suficiente para el smooth scroll)
    window.setTimeout(() => {
      lockRef.current = false;
    }, 500);
  }

  const orderedStats = useMemo(() => {
    const stats = detail?.stats || {};
    const keys = Object.keys(stats);

    const priority = [
      "hp",
      "hpperlevel",
      "mp",
      "mpperlevel",
      "armor",
      "armorperlevel",
      "spellblock",
      "spellblockperlevel",
      "attackdamage",
      "attackdamageperlevel",
      "attackspeed",
      "attackspeedperlevel",
      "attackrange",
      "movespeed",
      "hpregen",
      "hpregenperlevel",
      "mpregen",
      "mpregenperlevel",
      "crit",
      "critperlevel",
    ];

    const first = priority.filter((k) => keys.includes(k));
    const rest = keys.filter((k) => !first.includes(k)).sort((a, b) => a.localeCompare(b));
    const ordered = [...first, ...rest];

    return ordered.map((k) => [k, stats[k]]);
  }, [detail]);

  if (!openId) return null;

  return (
    <div
      className={`cm-overlay ${isClosing ? "is-closing" : "is-open"}`}
      onMouseDown={requestClose}
      onAnimationEnd={onAnimationEnd}
      role="presentation"
    >
      <div
        className={`cm-modal ${isClosing ? "is-closing" : "is-open"}`}
        ref={modalRef}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="cm-sticky">
          <button className="cm-close" onClick={requestClose} aria-label="Cerrar">
            ✕
          </button>

          <div className="cm-tabs" role="tablist" aria-label="Secciones del campeón">
            <button
              className={`cm-tab ${activeTab === "passive" ? "is-active" : ""}`}
              onClick={() => goTo("passive")}
              type="button"
              role="tab"
            >
              Pasiva
            </button>
            <button
              className={`cm-tab ${activeTab === "spells" ? "is-active" : ""}`}
              onClick={() => goTo("spells")}
              type="button"
              role="tab"
            >
              Habilidades
            </button>
            <button
              className={`cm-tab ${activeTab === "stats" ? "is-active" : ""}`}
              onClick={() => goTo("stats")}
              type="button"
              role="tab"
            >
              Stats
            </button>
          </div>
        </div>

        {loading && (
          <div className="cm-content">
            <SkeletonChampion />
          </div>
        )}

        {!loading && error && (
          <div className="cm-state cm-error">
            <strong>Error:</strong> {error}
          </div>
        )}

        {!loading && !error && detail && (
          <div className="cm-content">
            <div className="cm-hero">
              <img className="cm-hero-icon" src={detail.iconUrl} alt={detail.name} />
              <div className="cm-hero-info">
                <h2 className="cm-hero-name">{detail.name}</h2>
                <div className="cm-hero-title">{detail.title}</div>

                <div className="cm-tags">
                  {(detail.tags || []).map((t) => (
                    <span className="cm-tag" key={t}>
                      {t}
                    </span>
                  ))}
                  {detail.partype && <span className="cm-tag cm-tag-subtle">{detail.partype}</span>}
                </div>
              </div>
            </div>

            <section className="cm-section" ref={passiveRef}>
              <h3 className="cm-section-title">Pasiva</h3>

              <div className="cm-ability">
                {detail.passive?.iconUrl && (
                  <img className="cm-ability-icon" src={detail.passive.iconUrl} alt={detail.passive.name} />
                )}

                <div className="cm-ability-body">
                  <div className="cm-ability-head">
                    <span className="cm-key">P</span>
                    <span className="cm-name">{detail.passive?.name}</span>
                  </div>

                  <div
                    className="cm-text cm-html"
                    dangerouslySetInnerHTML={{ __html: detail.passive?.description || "" }}
                  />
                </div>
              </div>
            </section>

            <section className="cm-section" ref={spellsRef}>
              <h3 className="cm-section-title">Habilidades</h3>

              <div className="cm-abilities-grid">
                {(detail.spells || []).map((s) => (
                  <div className="cm-ability" key={s.key}>
                    {s.iconUrl && <img className="cm-ability-icon" src={s.iconUrl} alt={s.name} />}

                    <div className="cm-ability-body">
                      <div className="cm-ability-head">
                        <span className="cm-key">{s.key}</span>
                        <span className="cm-name">{s.name}</span>
                      </div>

                      <div className="cm-mini">
                        <span>
                          <strong>CD:</strong> {s.cooldown || "-"}
                        </span>
                        <span>
                          <strong>Coste:</strong> {s.cost || "-"}
                        </span>
                        <span>
                          <strong>Rango:</strong> {s.range || "-"}
                        </span>
                      </div>

                      <div
                        className="cm-text cm-html"
                        dangerouslySetInnerHTML={{ __html: s.tooltip || s.description || "" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="cm-section" ref={statsRef}>
              <h3 className="cm-section-title">Stats base</h3>

              <div className="cm-stats">
                {orderedStats.map(([k, v]) => (
                  <div className="cm-stat" key={k}>
                    <div className="cm-stat-left">
                      <div className="cm-stat-label">{statLabelEs(k)}</div>
                      <div className="cm-stat-key">{k}</div>
                    </div>
                    <div className="cm-stat-v">{formatVal(v)}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

/* Helpers */
function formatVal(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return "—";
  return Number.isInteger(n) ? String(n) : n.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
}

function statLabelEs(key) {
  const map = {
    hp: "Vida",
    hpperlevel: "Vida por nivel",
    mp: "Maná/Energía",
    mpperlevel: "Recurso por nivel",
    armor: "Armadura",
    armorperlevel: "Armadura por nivel",
    spellblock: "Resistencia mágica",
    spellblockperlevel: "RM por nivel",
    attackdamage: "Daño de ataque",
    attackdamageperlevel: "DA por nivel",
    attackspeed: "Velocidad de ataque",
    attackspeedperlevel: "Vel. ataque por nivel",
    attackrange: "Alcance de ataque",
    movespeed: "Velocidad de movimiento",
    hpregen: "Regeneración de vida",
    hpregenperlevel: "Regen vida por nivel",
    mpregen: "Regeneración de recurso",
    mpregenperlevel: "Regen recurso por nivel",
    crit: "Prob. crítico",
    critperlevel: "Crítico por nivel",
  };

  if (map[key]) return map[key];

  const pretty = key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/perlevel/gi, " por nivel")
    .replace(/hp/gi, "Vida")
    .replace(/mp/gi, "Recurso")
    .trim();

  return pretty.charAt(0).toUpperCase() + pretty.slice(1);
}

/* Skeleton */
function SkeletonChampion() {
  return (
    <div className="cm-skeleton">
      <div className="cm-skeleton-hero">
        <div className="sk sk-icon" />
        <div className="cm-skeleton-hero-text">
          <div className="sk sk-line w60" />
          <div className="sk sk-line w40" />
          <div className="sk sk-line w80" />
        </div>
      </div>

      <div className="cm-skeleton-section">
        <div className="sk sk-line w30" />
        <div className="cm-skeleton-card">
          <div className="sk sk-icon-sm" />
          <div className="cm-skeleton-card-text">
            <div className="sk sk-line w50" />
            <div className="sk sk-line w90" />
            <div className="sk sk-line w70" />
          </div>
        </div>
      </div>

      <div className="cm-skeleton-section">
        <div className="sk sk-line w30" />
        <div className="cm-skeleton-grid">
          {[1, 2, 3, 4].map((n) => (
            <div className="cm-skeleton-card" key={n}>
              <div className="sk sk-icon-sm" />
              <div className="cm-skeleton-card-text">
                <div className="sk sk-line w60" />
                <div className="sk sk-line w85" />
                <div className="sk sk-line w55" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}