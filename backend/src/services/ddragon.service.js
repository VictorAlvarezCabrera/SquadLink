const axios = require("axios");
const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 60 * 60 }); // 1 hora

async function getLatestDdragonVersion() {
  const cached = cache.get("ddragon_version");
  if (cached) return cached;

  const res = await axios.get("https://ddragon.leagueoflegends.com/api/versions.json");
  const version = res.data?.[0] || "latest";

  cache.set("ddragon_version", version);
  return version;
}

function getProfileIconUrl(version, iconId) {
  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${iconId}.png`;
}

module.exports = { getLatestDdragonVersion, getProfileIconUrl };