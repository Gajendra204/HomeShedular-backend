const express = require("express");
const router = express.Router();
const {
  addAppliance,
  getAppliances,
  deleteAppliance,
} = require("../controllers/applianceController");
const { protect } = require("../controllers/authController");

router.post("/add-appliance", protect, addAppliance);
router.get("/appliances", protect, getAppliances);
router.delete("/appliances/:id", protect, deleteAppliance);

module.exports = router;  