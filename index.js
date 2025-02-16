require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/applianceDB";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define Schema
const applianceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  purchaseDate: { type: Date, required: true },
  warrantyExpiryDate: { type: Date, required: true },
  maintenanceDuration: { type: Number, required: true }, // in months
});

const Appliance = mongoose.model("Appliance", applianceSchema);

// Add an Appliance
app.post("/api/add-appliance", async (req, res) => {
  try {
    const { name, purchaseDate, warrantyExpiryDate, maintenanceDuration } =
      req.body;

    if (
      !name ||
      !purchaseDate ||
      !warrantyExpiryDate ||
      maintenanceDuration == null
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newAppliance = new Appliance({
      name,
      purchaseDate: new Date(purchaseDate),
      warrantyExpiryDate: new Date(warrantyExpiryDate),
      maintenanceDuration,
    });

    await newAppliance.save();
    res.status(201).json({ message: "Appliance added successfully" });
  } catch (error) {
    console.error("Error adding appliance:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get Appliances
app.get("/api/appliances", async (req, res) => {
  try {
    const appliances = await Appliance.find();
    res.json(appliances);
  } catch (error) {
    console.error("Error fetching appliances:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete an Appliance
app.delete("/api/appliances/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the appliance exists
    const appliance = await Appliance.findById(id);
    if (!appliance) {
      return res.status(404).json({ error: "Appliance not found" });
    }

    // Delete the appliance
    await Appliance.findByIdAndDelete(id);
    res.json({ message: "Appliance deleted successfully" });
  } catch (error) {
    console.error("Error deleting appliance:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
