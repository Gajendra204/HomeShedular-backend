const cron = require("node-cron");
const Appliance = require("../models/Appliance");
const User = require("../models/User");
const {
  sendMaintenanceReminderEmail,
  sendWarrantyExpiryEmail,
} = require("./emailService");

const runDailyApplianceCheck = async () => {
  try {
    console.log("Running daily appliance check...");
    const users = await User.find();
    const now = new Date();
    const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
    const oneMonthInMs = 30 * 24 * 60 * 60 * 1000;

    for (const user of users) {
      const appliances = await Appliance.find({ user: user._id });

      for (const appliance of appliances) {
        // Check maintenance
        const nextMaintenanceDate = new Date(appliance.purchaseDate);
        nextMaintenanceDate.setMonth(
          nextMaintenanceDate.getMonth() + appliance.maintenanceDuration
        );

        // Check if maintenance is due (within next 7 days or overdue)
        const timeUntilMaintenance = nextMaintenanceDate - now;
        if (timeUntilMaintenance <= oneWeekInMs) {
          await sendMaintenanceReminderEmail(
            user.email,
            appliance.name,
            nextMaintenanceDate
          );
        }

        // Check warranty expiry (within next 30 days or expired)
        const warrantyExpiry = new Date(appliance.warrantyExpiryDate);
        const timeUntilWarrantyExpiry = warrantyExpiry - now;
        if (timeUntilWarrantyExpiry <= oneMonthInMs) {
          await sendWarrantyExpiryEmail(
            user.email,
            appliance.name,
            warrantyExpiry
          );
        }
      }
    }
    console.log("Daily appliance check completed.");
  } catch (error) {
    console.error("Error in daily appliance check:", error);
  }
};

const startCronJobs = () => {
  // Run daily at 11:35 PM
  cron.schedule("35 23 * * *", runDailyApplianceCheck);
};

module.exports = startCronJobs;