const express = require("express");
const { riotGet } = require("../services/riot.service");

const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 120 }); // Cache de 2 minutos

const router = express.Router();

/*
  Riot tiene dos tipos de routing:
  - Platform routing (euw1, na1, kr...)
  - Regional routing (europe, americas, asia)

  League y Summoner usan PLATFORM.
  Account-V1 usa REGIONAL.

  Esta función convierte plataforma -> región.
*/
function regionalHostFromPlatform(platform) {
  if (platform.startsWith("eu")) return "europe";
  if (platform.startsWith("na") || platform.startsWith("br") || platform.startsWith("la")) return "americas";
  if (platform.startsWith("kr") || platform.startsWith("jp")) return "asia";
  return "europe"; // fallback por seguridad
}

/*
  Función sleep para controlar velocidad de peticiones
  Evita romper el rate limit de Riot
*/
async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/*
  GET /api/featured
  Devuelve los jugadores Challenger más destacados
*/
router.get("/", async (req, res) => {
  try {
    const platform = (req.query.platform || "euw1").toLowerCase();
    const queue = req.query.queue || "RANKED_SOLO_5x5";
    const limit = Math.min(parseInt(req.query.limit || "10", 10), 20);

    // ✅ CACHE CHECK (AQUÍ)
    const cacheKey = `featured_${platform}_${queue}_${limit}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    // 1) Challenger list
    const league = await riotGet(
      platform,
      `/lol/league/v4/challengerleagues/by-queue/${queue}`
    );

    const topPlayers = (league.entries || [])
      .sort((a, b) => b.leaguePoints - a.leaguePoints)
      .slice(0, limit);

    const region = regionalHostFromPlatform(platform);
    const players = [];

    for (const player of topPlayers) {
      const summoner = await riotGet(
        platform,
        `/lol/summoner/v4/summoners/by-puuid/${player.puuid}`
      );

      const account = await riotGet(
        region,
        `/riot/account/v1/accounts/by-puuid/${player.puuid}`
      );

      players.push({
        puuid: player.puuid,
        riotId: `${account.gameName}#${account.tagLine}`,
        profileIconId: summoner.profileIconId,
        summonerLevel: summoner.summonerLevel,
        leaguePoints: player.leaguePoints,
        wins: player.wins,
        losses: player.losses,
        rank: player.rank,
        hotStreak: player.hotStreak,
      });

      await sleep(80);
    }

    // ✅ GUARDAR EN CACHE (AQUÍ)
    const payload = {
      ok: true,
      platform,
      queue,
      count: players.length,
      players,
    };

    cache.set(cacheKey, payload);

    return res.json({ ...payload, cached: false });
  } catch (err) {
    const status = err?.response?.status || 500;

    return res.status(status).json({
      ok: false,
      error: "Failed to fetch featured players",
      details: err?.response?.data || err.message,
    });
  }
});

module.exports = router;