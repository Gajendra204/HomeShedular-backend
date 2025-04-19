const mongoose = require("mongoose");

const VALID_APPLIANCE_TYPES = [
  'refrigerator',
  'washer',
  'dryer',
  'dishwasher',
  'microwave',
  'oven',
  'tv',
  'ac',
  'heater',
  'vacuum',
  'computer',
  'printer',
  'fan',
  'water_heater',
  'coffee_maker',
  'other' // Add a catch-all category
];

const applianceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: VALID_APPLIANCE_TYPES,
    default: 'other'
  },
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