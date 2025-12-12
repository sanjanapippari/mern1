const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const formRoutes = require("./routes/formRoutes");

const app = express();

// CORS configuration 
app.use(
  cors({
    origin: "*", // If want specific frontend: ["https://your-frontend.onrender.com"]
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Middlewares
app.use(express.json());
app.use(bodyParser.json());

// MongoDB Connection (For Render deployment)
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mernform";

if (!process.env.MONGO_URI && !process.env.MONGODB_URI) {
  console.warn("⚠️  WARNING: MONGO_URI environment variable not set. Using default local connection.");
  console.warn("⚠️  For production, set MONGO_URI in Render dashboard → Environment tab");
}

mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 10000, // Increase timeout for cloud connections
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    console.log(`📊 Database: ${mongoose.connection.name}`);
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    console.error("💡 Make sure MONGO_URI is set in Render environment variables");
    // Don't exit - let the server start even if DB fails (for health checks)
  });

// Request logging (optional)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Health check (Render pings this)
app.get("/", (req, res) => {
  res.json({
    message: "Backend Running Successfully 🚀",
    MongoDB: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    timestamp: new Date(),
  });
});

// Routes
app.use("/api", formRoutes);

// 404 handling
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Dynamic PORT for Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
