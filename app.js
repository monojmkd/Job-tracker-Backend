// app.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const aiRoutes = require("./src/routes/ai.routes");
const jobRoutes = require("./src/routes/job.routes");
const sequelize = require("./src/config/database");

const app = express();

app.use(cors());
app.use(express.json());

// Lazy DB init — runs once on first request (safe for serverless)
let dbReady = false;
app.use(async (req, res, next) => {
  if (!dbReady) {
    try {
      await sequelize.authenticate();
      await sequelize.sync();
      dbReady = true;
    } catch (err) {
      console.error("DB init failed:", err.message);
      return res.status(500).json({ error: "Database connection failed" });
    }
  }
  next();
});

app.get("/", (req, res) => {
  res.send("Govt Job Tracker API Running");
});

app.use("/api/ai", aiRoutes);
app.use("/api/jobs", jobRoutes);

// For Vercel: export the app, don't call listen()
// For local dev: listen if run directly
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
