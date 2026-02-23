function PlayerCard({ p }) {
  return (
    <div className="player-card">
      <img className="player-icon" src={p.iconUrl} alt={p.riotId} />

      <div className="player-name">{p.riotId}</div>

      <div className="player-stats">
        <div><strong>LP:</strong> {p.lp}</div>
        <div><strong>Nivel:</strong> {p.level}</div>
        <div><strong>W/L:</strong> {p.wins} / {p.losses}</div>
        <div><strong>Winrate:</strong> {p.winRate}%</div>
      </div>
    </div>
  );
}