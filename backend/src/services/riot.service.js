const axios = require("axios");

async function riotGet(platform, path) {
  const apiKey = process.env.RIOT_API_KEY;
  if (!apiKey) throw new Error("Missing RIOT_API_KEY");

  const url = `https://${platform}.api.riotgames.com${path}`;
  const res = await axios.get(url, {
    headers: { "X-Riot-Token": apiKey },
  });

  return res.data;
}

module.exports = { riotGet };