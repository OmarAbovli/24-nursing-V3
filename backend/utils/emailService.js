
const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify transporter connection on startup
transporter.verify(function(error, success) {
  if (error) {
    console.error('Email service error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {String} options.to - Recipient email
 * @param {String} options.subject - Email subject
 * @param {String} options.text - Plain text version of email
 * @param {String} options.html - HTML version of email
 * @returns {Promise} - Result of sending email
 */
const sendEmail = async (options) => {
  // Create mail options
  const mailOptions = {
    from: `Nursing Service <${process.env.EMAIL_FROM}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html || options.text
  };

  // Send email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    // Don't throw error - continue execution
    return { error };
  }
};

// Email templates
const sendAccountActivationEmail = async (user) => {
  const subject = 'Your Account Has Been Activated';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #3498db;">Account Activated!</h2>
      <p>Dear ${user.name},</p>
      <p>We're pleased to inform you that your account has been activated. You can now use all features of our nursing service platform.</p>
      <p>You can now make service requests, ask medical questions, and more.</p>
      <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #3498db;">
        <p style="margin: 0;">Email: ${user.email}</p>
        <p style="margin: 10px 0 0 0;">Account Type: ${user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}</p>
      </div>
      <p>If you have any questions, please don't hesitate to contact our support team.</p>
      <p>Best regards,<br>The Nursing Service Team</p>
    </div>
  `;

  return sendEmail({
    to: user.email,
    subject,
    html
  });
};

const sendServiceRequestConfirmation = async (user, request) => {
  const subject = 'Service Request Confirmation';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #3498db;">Service Request Received</h2>
      <p>Dear ${user.name},</p>
      <p>We've received your service request. Here are the details:</p>
      <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #3498db;">
        <p style="margin: 0;"><strong>Request ID:</strong> ${request._id}</p>
        <p style="margin: 10px 0 0 0;"><strong>Patient Name:</strong> ${request.patientName}</p>
        <p style="margin: 10px 0 0 0;"><strong>Service Type:</strong> ${request.serviceType}</p>
        <p style="margin: 10px 0 0 0;"><strong>Status:</strong> ${request.status}</p>
      </div>
      <p>We'll notify you when a nurse accepts your request.</p>
      <p>Best regards,<br>The Nursing Service Team</p>
    </div>
  `;

  return sendEmail({
    to: user.email,
    subject,
    html
  });
};

const sendServiceAssignmentNotification = async (user, request, nurse) => {
  const subject = 'Nurse Assigned to Your Service Request';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #3498db;">Nurse Assigned</h2>
      <p>Dear ${user.name},</p>
      <p>A nurse has been assigned to your service request:</p>
      <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #3498db;">
        <p style="margin: 0;"><strong>Request ID:</strong> ${request._id}</p>
        <p style="margin: 10px 0 0 0;"><strong>Nurse Name:</strong> ${nurse.name}</p>
        <p style="margin: 10px 0 0 0;"><strong>Nurse Phone:</strong> ${nurse.phone}</p>
      </div>
      <p>The nurse will contact you shortly to confirm details.</p>
      <p>Best regards,<br>The Nursing Service Team</p>
    </div>
  `;

  return sendEmail({
    to: user.email,
    subject,
    html
  });
};

const sendServiceCompletionNotification = async (user, request) => {
  const subject = 'Service Completed';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #3498db;">Service Completed</h2>
      <p>Dear ${user.name},</p>
      <p>The nursing service you requested has been completed:</p>
      <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #3498db;">
        <p style="margin: 0;"><strong>Request ID:</strong> ${request._id}</p>
        <p style="margin: 10px 0 0 0;"><strong>Service Type:</strong> ${request.serviceType}</p>
        <p style="margin: 10px 0 0 0;"><strong>Total Cost:</strong> $${request.cost}</p>
      </div>
      <p>Please take a moment to rate the service and provide feedback.</p>
      <p>Best regards,<br>The Nursing Service Team</p>
    </div>
  `;

  return sendEmail({
    to: user.email,
    subject,
    html
  });
};

const sendNewAccountNotificationToAdmin = async (admin, newUser) => {
  const subject = 'New Account Registration';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #3498db;">New Account Registration</h2>
      <p>Dear Admin,</p>
      <p>A new user has registered on the platform and needs activation:</p>
      <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #3498db;">
        <p style="margin: 0;"><strong>Name:</strong> ${newUser.name}</p>
        <p style="margin: 10px 0 0 0;"><strong>Email:</strong> ${newUser.email}</p>
        <p style="margin: 10px 0 0 0;"><strong>Account Type:</strong> ${newUser.userType.charAt(0).toUpperCase() + newUser.userType.slice(1)}</p>
        <p style="margin: 10px 0 0 0;"><strong>Registration Date:</strong> ${new Date(newUser.registrationDate).toLocaleString()}</p>
      </div>
      <p>Please review and activate this account from the admin dashboard.</p>
      <p>Best regards,<br>The System</p>
    </div>
  `;

  return sendEmail({
    to: admin.email,
    subject,
    html
  });
};

module.exports = {
  sendEmail,
  sendAccountActivationEmail,
  sendServiceRequestConfirmation,
  sendServiceAssignmentNotification,
  sendServiceCompletionNotification,
  sendNewAccountNotificationToAdmin
};
