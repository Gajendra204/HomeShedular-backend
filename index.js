require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const startCronJobs = require("./services/cronService");
const authRoutes = require("./routes/authRoutes");
const applianceRoutes = require("./routes/applianceRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
connectDB();

// Start cron jobs
startCronJobs();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", applianceRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});