const nodemailer = require('nodemailer');

// Function to send email with template
const sendTemplateMail = async (title, destinationEmail, templateData) => {
  try {
    // Configure transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 465, // Use SSL (465) or startTLS (587)
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Generate email body using template data
    const htmlContent = generateTemplate(title, templateData);

    // Send email
    const info = await transporter.sendMail({
      from: `${process.env.COMPANY_NAME} <${process.env.EMAIL_USERNAME}>`,
      to: destinationEmail,
      subject: title,
      html: htmlContent,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    return {
      success: false,
      code: 'mail-error',
      message: error.message,
    };
  }
};

// Function to generate specific email templates
const generateTemplate = (title, templateData) => {
  switch (title) {
    case 'Account Verification':
      return `
        <div style="font-family: Arial, sans-serif;">
          <h2>Account Verification</h2>
          <p>Hello ${templateData?.name || 'User'},</p>
          <p>Please verify your account by entering this code:</p>
          <p style="color: #4CAF50;font-weight:700;">${templateData.verification_code}</p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `;
      
    case 'Password Reset':
      return `
        <div style="font-family: Arial, sans-serif;">
          <h2>Password Reset Request</h2>
          <p>Hello ${templateData?.name || 'User'},</p>
          <p>We received a request to reset your password. Enter this code:</p>
          <p style="color: #4CAF50;font-weight:700;">${templateData.verification_code}</p>
          <p>If you did not request a password reset, you can ignore this email.</p>
        </div>
      `;

    default:
      return `<div>Hello, this is a test template for ${title}!</div>`;
  }
};

module.exports = { sendTemplateMail };
