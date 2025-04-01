// emailService.js
const nodemailer = require("nodemailer");

// Set up Nodemailer transporter using Gmail (or another email provider if needed)
const transporter = nodemailer.createTransport({
  service: "gmail", // Use your preferred email service
  auth: {
    user: "bufoodapp@gmail.com",     // Your Gmail address
    pass: "khjqiklykeibearc",        // Your Gmail app-specific password (NOT your regular Gmail password)
  },
});

// Function to send verification email
const sendVerificationEmail = async (email, verificationLink) => {
  // HTML body with a button
  const htmlContent = `
    <p>Hello,</p>
    <p>Thank you for registering! Please verify your email by clicking the button below:</p>
    <a href="${verificationLink}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 15px 25px; font-size: 16px; text-align: center; border-radius: 5px; text-decoration: none;">
      Verify Email
    </a>
    <p>Best regards,<br>Pogi na Admin</p>
  `;

  const mailOptions = {
    from: "bufoodapp@gmail.com",    // Your email address
    to: email,                      // Recipient's email address
    subject: "Email Verification",  // Subject of the email
    html: htmlContent,              // HTML content with the button
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = {
  sendVerificationEmail,  // Export the function
};
