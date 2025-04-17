const transporter = require("../config/email");

const sendApplianceAddedEmail = async (email, applianceName, purchaseDate) => {
  await transporter.sendMail({
    from: `HomeScheduler <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `🎉 Your appliance "${applianceName}" was successfully added!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="background-color: #4CAF50; padding: 20px; color: white; text-align: center; border-radius: 8px 8px 0 0;">
          <h1>Appliance Registered Successfully!</h1>
        </div>
        <div style="padding: 20px;">
          <p>Hello,</p>
          <p>Your appliance <strong>${applianceName}</strong> has been added to HomeScheduler.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #4CAF50; margin: 20px 0;">
            <p><strong>Purchase Date:</strong> ${new Date(
              purchaseDate
            ).toDateString()}</p>
          </div>
          
          <p>We'll notify you when maintenance is due or warranty expires.</p>
        </div>
        <div style="text-align: center; padding: 10px; background-color: #f5f5f5; border-radius: 0 0 8px 8px;">
          <p>© ${new Date().getFullYear()} HomeScheduler</p>
        </div>
      </div>
    `,
  });
};

const sendMaintenanceReminderEmail = async (email, applianceName, dueDate) => {
  await transporter.sendMail({
    from: `HomeScheduler <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `⚠️ Maintenance Required for "${applianceName}"`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="background-color: #FF9800; padding: 20px; color: white; text-align: center; border-radius: 8px 8px 0 0;">
          <h1>Maintenance Due Soon!</h1>
        </div>
        <div style="padding: 20px;">
          <p>Hello,</p>
          <p>Your appliance <strong>${applianceName}</strong> requires scheduled maintenance.</p>
          
          <div style="background-color: #fff8e1; padding: 15px; border-left: 4px solid #FF9800; margin: 20px 0;">
            <p><strong>Due Date:</strong> ${dueDate.toDateString()}</p>
            <p><strong>Status:</strong> ${
              new Date() > dueDate ? "OVERDUE" : "Due Soon"
            }</p>
          </div>
          
          <p>Please schedule maintenance to avoid performance issues.</p>
    
        </div>
        <div style="text-align: center; padding: 10px; background-color: #f5f5f5; border-radius: 0 0 8px 8px;">
          <p>© ${new Date().getFullYear()} HomeScheduler</p>
        </div>
      </div>
    `,
  });
};

const sendWarrantyExpiryEmail = async (email, applianceName, expiryDate) => {
  await transporter.sendMail({
    from: `HomeScheduler <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `🔴 Warranty Expiring for "${applianceName}"`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="background-color: #F44336; padding: 20px; color: white; text-align: center; border-radius: 8px 8px 0 0;">
          <h1>Warranty Expiry Alert!</h1>
        </div>
        <div style="padding: 20px;">
          <p>Hello,</p>
          <p>The warranty for <strong>${applianceName}</strong> is about to expire.</p>
          
          <div style="background-color: #ffebee; padding: 15px; border-left: 4px solid #F44336; margin: 20px 0;">
            <p><strong>Expiry Date:</strong> ${expiryDate.toDateString()}</p>
            <p><strong>Status:</strong> ${
              new Date() > expiryDate ? "EXPIRED" : "Expiring Soon"
            }</p>
          </div>
          
          <p>Consider extending the warranty to avoid unexpected repair costs.</p>
        </div>
        <div style="text-align: center; padding: 10px; background-color: #f5f5f5; border-radius: 0 0 8px 8px;">
          <p>© ${new Date().getFullYear()} HomeScheduler</p>
        </div>
      </div>
    `,
  });
};

module.exports = {
  sendApplianceAddedEmail,
  sendMaintenanceReminderEmail,
  sendWarrantyExpiryEmail,
};