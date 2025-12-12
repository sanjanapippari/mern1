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
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb+srv://sanjanapippari2005_db_user:71y5e74W36IVOQnD@mern.igqsdwo.mongodb.net/mernform?retryWrites=true&w=majority";

if (process.env.MONGO_URI || process.env.MONGODB_URI) {
  console.log("🔗 Connecting to MongoDB (using environment variable)...");
  console.log(`📍 URI: ${MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`); // Hide credentials in logs
} else {
  console.log("🔗 Connecting to MongoDB (using default connection string)...");
  console.log("⚠️  Note: Using hardcoded connection string. For production, use environment variables.");
}

// Connect to MongoDB with retry logic
const connectDB = async () => {
  if (!MONGO_URI) {
    console.warn("⚠️  Skipping MongoDB connection - MONGO_URI not set");
    return;
  }

  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 15000, // 15 seconds for cloud connections
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });
    
    console.log("✅ MongoDB Connected Successfully");
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });
    
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:");
    console.error(`   Error: ${err.message}`);
    
    if (err.message.includes('ECONNREFUSED')) {
      console.error("   💡 This usually means:");
      console.error("      - MONGO_URI is pointing to localhost (127.0.0.1)");
      console.error("      - You need to use MongoDB Atlas connection string");
      console.error("      - Format: mongodb+srv://user:pass@cluster.mongodb.net/dbname");
    } else if (err.message.includes('authentication failed')) {
      console.error("   💡 Check your MongoDB username and password");
    } else if (err.message.includes('timeout')) {
      console.error("   💡 Check your network access in MongoDB Atlas");
      console.error("      - Go to Network Access → Add IP: 0.0.0.0/0");
    }
    
    console.error("");
    console.error("⚠️  Server will continue running, but API endpoints will fail.");
    console.error("   Fix MONGO_URI and restart the service.");
  }
};

// Connect to database
connectDB();

// Request logging (optional)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Database connection check middleware (for API routes)
app.use("/api", (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: "Database not connected",
      message: "MongoDB connection is not available. Please check MONGO_URI environment variable.",
      readyState: mongoose.connection.readyState,
      states: {
        0: "disconnected",
        1: "connected",
        2: "connecting",
        3: "disconnecting"
      }
    });
  }
  next();
});

// Health check (Render pings this)
app.get("/", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStates = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting"
  };
  
  res.json({
    status: "running",
    message: "Backend API is running 🚀",
    timestamp: new Date().toISOString(),
    database: {
      status: dbStates[dbState] || "unknown",
      readyState: dbState,
      connected: dbState === 1,
      name: mongoose.connection.name || "N/A",
      host: mongoose.connection.host || "N/A",
      mongoUriSet: !!MONGO_URI
    },
    endpoints: {
      health: "GET /",
      api: "GET /api",
      forms: {
        getAll: "GET /api/form",
        create: "POST /api/form",
        getOne: "GET /api/form/:id",
        update: "PUT /api/form/:id",
        delete: "DELETE /api/form/:id"
      }
    }
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
