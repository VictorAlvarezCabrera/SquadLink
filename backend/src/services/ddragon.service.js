const axios = require("axios");
const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 60 * 60 }); // 1 hora

// Puedes cambiar a "en_US" o "es_ES". Si no existe es_ES en tu versión, pon en_US.
const LOCALE = "es_ES";

async function getLatestDdragonVersion() {
  const cached = cache.get("ddragon_version");
  if (cached) return cached;

  const res = await axios.get("https://ddragon.leagueoflegends.com/api/versions.json");
  const version = res.data?.[0] || "latest";

  cache.set("ddragon_version", version);
  return version;
}

// --- ICONOS ---

function getProfileIconUrl(version, iconId) {
  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${iconId}.png`;
}

function champIconUrl(version, champId) {
  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champId}.png`;
}

// --- JSON CAMPEONES ---
async function fetchChampionList(version) {
  const url = `https://ddragon.leagueoflegends.com/cdn/${version}/data/${LOCALE}/champion.json`;
  const res = await axios.get(url);
  return res.data;
}

// --- DETALLE CAMPEÓN (con habilidades) ---
function spellIconUrl(version, spellImageFull) {
  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${spellImageFull}`;
}

function passiveIconUrl(version, passiveImageFull) {
  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/passive/${passiveImageFull}`;
}

async function fetchChampionDetail(version, champId) {
  const url = `https://ddragon.leagueoflegends.com/cdn/${version}/data/${LOCALE}/champion/${champId}.json`;
  const res = await axios.get(url);
  return res.data;
}

module.exports = {
  getLatestDdragonVersion,
  getProfileIconUrl,
  champIconUrl,
  spellIconUrl,
  passiveIconUrl,
  fetchChampionDetail,
  fetchChampionList,
};