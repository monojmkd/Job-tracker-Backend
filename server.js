// server.js — only used for local development
// Vercel uses app.js directly (via vercel.json), not this file.

require("dotenv").config();
const sequelize = require("./src/config/database");
const app = require("./src/app");
const scrapeRSS = require("./src/scrappers/rss.scrapper");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    await sequelize.sync();
    console.log("✅ Tables ready");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

    // Scraper only runs locally — not on Vercel (no persistent process)
    scrapeRSS();
  } catch (err) {
    console.error("❌ Server failed to start:", err.message);
  }
}

startServer();
