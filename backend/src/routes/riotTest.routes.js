const express = require("express");
const { riotGet } = require("../services/riot.service");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const data = await riotGet("euw1", "/lol/status/v4/platform-data");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;