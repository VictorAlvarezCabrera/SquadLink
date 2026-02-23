import { useEffect, useState } from "react";
import "../index.css";
import "./Home.css";
import PlayerCard from "../components/PlayerCard";

export default function Home() {

  const [status, setStatus] = useState("Comprobando API...");
  const [players, setPlayers] = useState([]); // 👈 AÑADIR
  const [platform, setPlatform] = useState("EUW1"); // Plataforma fija por ahora, pero se puede hacer dinámica
  const [loading, setLoading] = useState(false); // Estado de carga para los jugadores destacados

  const numPlayers = 8; // Cambia este número para mostrar más o menos jugadores destacados
  useEffect(() => {

    // API health
    fetch("http://localhost:3001/api/health")
      .then((r) => r.json())
      .then((data) =>setStatus(data?.ok ? "API conectada ✅" : "API respondió raro ⚠️"))
      .catch(() => setStatus("No se pudo conectar con la API ❌"));

    setLoading(true); // Iniciar carga de jugadores destacados
    // Featured players 👇 AQUÍ
    fetch(`http://localhost:3001/api/featured?platform=${platform}&limit=${numPlayers}`)
      .then((r) => r.json())
      .then((data) => {console.log("Featured data:", data);
        setPlayers(data?.players || []);
      })
      .catch((e) => console.error("Error cargando destacados:", e))
      .finally(() => setLoading(false)); // Finalizar carga

  }, [platform]);

  const HTMLCard = players.map((p) => (
    <PlayerCard key={p.riotId} p={p} />
  ));

  return (
    <main>
      <section className="home-section">
        <div className="home-header">
          <h1>SquadLink</h1>
          <p>Encuentra jugadores, crea equipos y organiza partidas.</p>
        </div>

        <form className="search-player">
          <input type="search" name="search-player" placeholder="Riot ID, ej. player#NA1" required/>
          <button type="submit">Buscar</button>
        </form>

        <div className="region-selector">
            <label>Región:</label>
                <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                <option value="euw1">EUW</option>
                <option value="na1">NA</option>
                <option value="kr">KR</option>
                <option value="eun1">EUNE</option>
        </select>
        </div>
      </section>

      <section className="featured-grid">
        {HTMLCard}
      </section>
    </main>
  );
}