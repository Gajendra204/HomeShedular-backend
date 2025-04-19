// migrate-appliance-types.js
require("dotenv").config();
const mongoose = require("mongoose");
const Appliance = require("./models/Appliance");

async function runMigration() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Starting migration...");
    const result = await Appliance.updateMany(
      { type: { $exists: false } }, // Find docs without type field
      { $set: { type: "other" } } // Set default type
    );

    console.log(`Migration complete. Updated ${result.nModified} appliances.`);
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

runMigration();
