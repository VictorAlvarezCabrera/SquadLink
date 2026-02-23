const express = require("express");
const NodeCache = require("node-cache");

const {
  getLatestDdragonVersion,
  fetchChampionList,
  champIconUrl,
  fetchChampionDetail,
  spellIconUrl,
  passiveIconUrl,
} = require("../services/ddragon.service");

const router = express.Router();

// Cache 1 hora (DDragon cambia por parche)
const cache = new NodeCache({ stdTTL: 60 * 60 });

// ✅ GET /api/champions -> lista ligera de campeones
router.get("/", async (req, res) => {
  try {
    const cacheKey = "champions_list_v1";
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ ...cached, cached: true });

    const version = await getLatestDdragonVersion();
    const raw = await fetchChampionList(version); // champion.json

    const champions = Object.values(raw.data || {}).map((c) => ({
      id: c.id,            // "Aatrox"
      name: c.name,        // "Aatrox"
      title: c.title,      // "..."
      tags: c.tags,        // ["Fighter","Tank"]
      blurb: c.blurb,      // texto corto
      iconUrl: champIconUrl(version, c.id),
    }));

    champions.sort((a, b) => a.name.localeCompare(b.name));

    const payload = {
      ok: true,
      version,
      count: champions.length,
      champions,
    };

    cache.set(cacheKey, payload);
    return res.json({ ...payload, cached: false });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// ✅ GET /api/champions/:id -> detalle de un campeón (pasiva + QWER + stats base)
router.get("/:id", async (req, res) => {
  try {
    const champId = req.params.id; // ej: "Aatrox"
    const cacheKey = `champion_detail_${champId}`;

    const cached = cache.get(cacheKey);
    if (cached) return res.json({ ...cached, cached: true });

    const version = await getLatestDdragonVersion();
    const raw = await fetchChampionDetail(version, champId);

    const champ = raw?.data?.[champId];
    if (!champ) {
      return res.status(404).json({ ok: false, error: "Campeón no encontrado" });
    }

    // Pasiva
    const passive = {
      name: champ.passive?.name || "",
      description: champ.passive?.description || "",
      iconUrl: champ.passive?.image?.full
        ? passiveIconUrl(version, champ.passive.image.full)
        : null,
    };

    // Spells Q/W/E/R
    const spells = (champ.spells || []).map((s, idx) => ({
      key: ["Q", "W", "E", "R"][idx] || String(idx + 1),
      name: s.name || "",
      description: s.description || "",
      tooltip: s.tooltip || "",
      cooldown: s.cooldownBurn || "",
      cost: s.costBurn || "",
      range: s.rangeBurn || "",
      iconUrl: s.image?.full ? spellIconUrl(version, s.image.full) : null,
    }));

    const payload = {
      ok: true,
      version,
      champion: {
        id: champ.id,
        name: champ.name,
        title: champ.title,
        tags: champ.tags,
        partype: champ.partype, // Mana/Energy/etc.
        lore: champ.lore,
        iconUrl: champIconUrl(version, champ.id),
        passive,
        spells,
        stats: champ.stats || {}, // stats base
      },
    };

    cache.set(cacheKey, payload);
    return res.json({ ...payload, cached: false });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;