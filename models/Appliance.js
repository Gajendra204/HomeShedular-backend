const mongoose = require("mongoose");

const applianceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  purchaseDate: { type: Date, required: true },
  warrantyExpiryDate: { type: Date, required: true },
  maintenanceDuration: { type: Number, required: true }, // in months
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Appliance", applianceSchema);