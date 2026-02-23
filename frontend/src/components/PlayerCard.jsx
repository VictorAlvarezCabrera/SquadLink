import "./PlayerCard.css";

export default function PlayerCard({ p }) {
  if (!p) return null;

   let platform = p.platform || "Desconocida";
  const wins = p.wins ?? 0;
  const losses = p.losses ?? 0;
  const lp = p.lp ?? 0;
  const level = p.level ?? 0;
  const winRate = p.winRate ?? 0;
  const iconUrl = p.iconUrl;

  if (p.platform === "EUW1") {
    platform = "EUW";
  } else if (p.platform === "NA1") {
    platform = "NA";
  } else if (p.platform === "KR") {
    platform = "KR";
  } else if (p.platform === "EUN1") {
    platform = "EUNE";
  } 

  return (
    <div className="player-card">
      <img className="player-icon" src={iconUrl} alt={p.riotId} />

      <div className="player-name">{p.riotId}</div>

      <div className="player-stats">
        <div><strong>Región:</strong> {platform}</div>
        <div><strong>LP:</strong> {lp}</div>
        <div><strong>Nivel:</strong> {level}</div>
        <div><strong>W/L:</strong> {wins} / {losses}</div>
        <div><strong>Winrate:</strong> {winRate}%</div>
      </div>
    </div>
  );
}