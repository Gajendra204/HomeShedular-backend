const Appliance = require("../models/Appliance");
const {
  sendApplianceAddedEmail,
} = require("../services/emailService");

const addAppliance = async (req, res) => {
  try {
    const {
      name,
      purchaseDate,
      warrantyExpiryDate,
      maintenanceDuration,
    } = req.body;

    if (
      !name ||
      !purchaseDate ||
      !warrantyExpiryDate ||
      !maintenanceDuration
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newAppliance = new Appliance({
      name,
      purchaseDate: new Date(purchaseDate),
      warrantyExpiryDate: new Date(warrantyExpiryDate),
      maintenanceDuration,
      user: req.user.id,
    });

    await newAppliance.save();

    // Send confirmation email
    await sendApplianceAddedEmail(req.user.email, name, purchaseDate);

    res.status(201).json({ message: "Appliance added successfully" });
  } catch (error) {
    console.error("Error adding appliance:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getAppliances = async (req, res) => {
  try {
    // Only get appliances for the logged-in user
    const appliances = await Appliance.find({ user: req.user.id });
    const now = new Date();

    const result = appliances.map((appliance) => {
      const maintenanceDue = new Date(appliance.purchaseDate);
      maintenanceDue.setMonth(
        maintenanceDue.getMonth() + appliance.maintenanceDuration
      );

      const isExpired = now > new Date(appliance.warrantyExpiryDate);
      const isMaintenanceNeeded = now > maintenanceDue;

      // Calculate days until maintenance/warranty expiry
      const daysUntilMaintenance = Math.ceil(
        (maintenanceDue - now) / (1000 * 60 * 60 * 24)
      );
      const daysUntilWarrantyExpiry = Math.ceil(
        (new Date(appliance.warrantyExpiryDate) - now) / (1000 * 60 * 60 * 24)
      );

      return {
        ...appliance.toObject(),
        isExpired,
        isMaintenanceNeeded,
        daysUntilMaintenance,
        daysUntilWarrantyExpiry,
        nextMaintenanceDate: maintenanceDue,
        warrantyExpiryDate: appliance.warrantyExpiryDate,
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Error fetching appliances:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteAppliance = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the appliance exists and belongs to the user
    const appliance = await Appliance.findOne({ _id: id, user: req.user.id });
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
};

module.exports = {
  addAppliance,
  getAppliances,
  deleteAppliance,
};