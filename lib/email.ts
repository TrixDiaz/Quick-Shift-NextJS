import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER || "teamstrp14@gmail.com",
    pass: process.env.SMTP_PASS || "wbpa qlwp jgol itrl",
  },
});

export const sendContactEmail = async (
  name: string,
  email: string,
  message: string
) => {
  try {
    const info = await transporter.sendMail({
      from: `"${name}" <${process.env.SMTP_USER || "teamstrp14@gmail.com"}>`,
      to: process.env.SMTP_USER || "teamstrp14@gmail.com",
      replyTo: email,
      subject: `📩 New Contact Us Message from ${name}`,
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden;">
          <div style="background: #1c402a; color: #fff; padding: 16px 24px; text-align: center;">
            <h2 style="margin: 0;">New Contact Request</h2>
          </div>
          <div style="padding: 24px;">
            <p style="margin: 0 0 12px;">You've received a new message from your website contact form:</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
              <tr>
                <td style="padding: 8px; font-weight: bold; width: 120px;">Name:</td>
                <td style="padding: 8px; background: #f9f9f9;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Email:</td>
                <td style="padding: 8px; background: #f9f9f9;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; vertical-align: top;">Message:</td>
                <td style="padding: 8px; background: #f9f9f9; white-space: pre-line;">${message}</td>
              </tr>
            </table>

            <p style="margin-top: 16px; font-size: 12px; color: #777;">
              This message was sent from your website's contact form.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Message sent: %s", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("Error sending email", error);
    return { success: false, error };
  }
};

export const sendServicesEmail = async (
  fullName: string,
  phone: string,
  email: string,
  province: string,
  address: string,
  ssn: string,
  licenseNumber: string,
  dateOfBirth: string,
  bloodType: string,
  frontId: string | null,
  backId: string | null,
  videoBlob: string | null,
  recordingTime: number,
  attachments: Array<{
    filename: string;
    content: string;
    encoding: string;
  }>
) => {
  try {
    // Create email content
    const emailContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: auto; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden;">
          <div style="background: #1c402a; color: #fff; padding: 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">🚗 Philippine Driver's License Verification</h1>
              <p style="margin: 5px 0 0; opacity: 0.9;">New Identity Verification Request</p>
          </div>
          
          <div style="padding: 30px;">
              <h2 style="color: #1c402a; margin-top: 0; border-bottom: 2px solid #1c402a; padding-bottom: 10px;">
                  📋 Personal Information
              </h2>
              
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                  <tr>
                      <td style="padding: 12px; font-weight: bold; width: 200px; background: #f8f9fa; border: 1px solid #dee2e6;">Full Name:</td>
                      <td style="padding: 12px; border: 1px solid #dee2e6;">${fullName}</td>
                  </tr>
                  <tr>
                      <td style="padding: 12px; font-weight: bold; background: #f8f9fa; border: 1px solid #dee2e6;">Email:</td>
                      <td style="padding: 12px; border: 1px solid #dee2e6;">${email}</td>
                  </tr>
                  <tr>
                      <td style="padding: 12px; font-weight: bold; background: #f8f9fa; border: 1px solid #dee2e6;">Phone:</td>
                      <td style="padding: 12px; border: 1px solid #dee2e6;">${phone}</td>
                  </tr>
                  <tr>
                      <td style="padding: 12px; font-weight: bold; background: #f8f9fa; border: 1px solid #dee2e6;">Province:</td>
                      <td style="padding: 12px; border: 1px solid #dee2e6;">${province || 'Not provided'}</td>
                  </tr>
                  <tr>
                      <td style="padding: 12px; font-weight: bold; background: #f8f9fa; border: 1px solid #dee2e6;">Address:</td>
                      <td style="padding: 12px; border: 1px solid #dee2e6;">${address || 'Not provided'}</td>
                  </tr>
                  <tr>
                      <td style="padding: 12px; font-weight: bold; background: #f8f9fa; border: 1px solid #dee2e6;">SSN:</td>
                      <td style="padding: 12px; border: 1px solid #dee2e6;">${ssn || 'Not provided'}</td>
                  </tr>
              </table>

              <h2 style="color: #1c402a; border-bottom: 2px solid #1c402a; padding-bottom: 10px;">
                  🆔 License Information
              </h2>
              
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                  <tr>
                      <td style="padding: 12px; font-weight: bold; width: 200px; background: #f8f9fa; border: 1px solid #dee2e6;">License Number:</td>
                      <td style="padding: 12px; border: 1px solid #dee2e6;">${licenseNumber || 'Not provided'}</td>
                  </tr>
                  <tr>
                      <td style="padding: 12px; font-weight: bold; background: #f8f9fa; border: 1px solid #dee2e6;">Date of Birth:</td>
                      <td style="padding: 12px; border: 1px solid #dee2e6;">${dateOfBirth || 'Not provided'}</td>
                  </tr>
                  <tr>
                      <td style="padding: 12px; font-weight: bold; background: #f8f9fa; border: 1px solid #dee2e6;">Blood Type:</td>
                      <td style="padding: 12px; border: 1px solid #dee2e6;">${bloodType || 'Not provided'}</td>
                  </tr>
              </table>

              <h2 style="color: #1c402a; border-bottom: 2px solid #1c402a; padding-bottom: 10px;">
                  🎥 Video Verification
              </h2>
              
              <div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 5px; padding: 15px; margin-bottom: 25px;">
                  <h3 style="margin: 0 0 10px; color: #155724;">
                      ✅ Video Recording Completed
                  </h3>
                  <p style="margin: 0; color: #155724;">
                      <strong>Recording Duration:</strong> ${recordingTime || 0} seconds<br>
                      <strong>Status:</strong> Video verification completed<br>
                      <strong>Type:</strong> Live video verification
                  </p>
              </div>

              <h2 style="color: #1c402a; border-bottom: 2px solid #1c402a; padding-bottom: 10px;">
                  📸 Attached Documents
              </h2>
              
              <div style="margin-bottom: 20px;">
                  <p><strong>Front ID Image:</strong> ${frontId ? '✅ Provided' : '❌ Not provided'}</p>
                  <p><strong>Back ID Image:</strong> ${backId ? '✅ Provided' : '❌ Not provided'}</p>
                  <p><strong>Verification Video:</strong> ${videoBlob ? '✅ Recorded' : '❌ Not provided'}</p>
              </div>

              <div style="background: #e9ecef; padding: 15px; border-radius: 5px; margin-top: 25px;">
                  <p style="margin: 0; font-size: 14px; color: #6c757d;">
                      <strong>Submission Details:</strong><br>
                      • Submitted on: ${new Date().toLocaleString()}<br>
                      • Form Type: Philippine Driver's License Verification<br>
                      • This is an automated submission from the QuickShift identity verification system.
                  </p>
              </div>
          </div>
      </div>
    `;

    // Send admin email
    const adminInfo = await transporter.sendMail({
      from: `"QuickShift Identity Verification" <${process.env.SMTP_USER || "teamstrp14@gmail.com"}>`,
      to: process.env.SMTP_USER || "teamstrp14@gmail.com",
      replyTo: email,
      subject: `🚗 New Driver's License Verification - ${fullName}`,
      html: emailContent,
      attachments: attachments
    });

    console.log("Services admin email sent: %s", adminInfo.messageId);

    // Send completion notification email to user
    const completionMessage = `
Hello ${fullName},

Thank you for completing your Driver's License verification process with QuickShift!

Your verification request has been successfully submitted and is now under review. Here are the details of your submission:

📋 Personal Information:
• Name: ${fullName}
• Email: ${email}
• Phone: ${phone}
• Province: ${province || 'Not provided'}
• SSN: ${ssn || 'Not provided'}
• License Number: ${licenseNumber || 'Not provided'}

📸 Documents Submitted:
• Front ID: ${frontId ? '✅ Provided' : '❌ Not provided'}
• Back ID: ${backId ? '✅ Provided' : '❌ Not provided'}
• Verification Video: ${videoBlob ? '✅ Recorded' : '❌ Not provided'}

🎥 Video Verification:
• Recording Duration: ${recordingTime || 0} seconds
• Status: Video verification completed

We will review your submission and get back to you within 1-2 business days. If you have any questions or need assistance, please don't hesitate to contact us.

Best regards,
QuickShift Team
    `;

    const userInfo = await transporter.sendMail({
      from: `"QuickShift Team" <${process.env.SMTP_USER || "teamstrp14@gmail.com"}>`,
      to: email,
      subject: `✅ Driver's License Verification Submitted - ${fullName}`,
      text: completionMessage,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden;">
          <div style="background: #1c402a; color: #fff; padding: 16px 24px; text-align: center;">
            <h2 style="margin: 0;">✅ Verification Submitted</h2>
          </div>
          <div style="padding: 24px;">
            <p style="margin: 0 0 12px;">Hello ${fullName},</p>
            <p style="margin: 0 0 12px;">Thank you for completing your Driver's License verification process with QuickShift!</p>
            <p style="margin: 0 0 12px;">Your verification request has been successfully submitted and is now under review.</p>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px; color: #1c402a;">Submission Details:</h3>
              <p style="margin: 0;"><strong>Name:</strong> ${fullName}</p>
              <p style="margin: 0;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 0;"><strong>Phone:</strong> ${phone}</p>
              <p style="margin: 0;"><strong>Province:</strong> ${province || 'Not provided'}</p>
              <p style="margin: 0;"><strong>SSN:</strong> ${ssn || 'Not provided'}</p>
              <p style="margin: 0;"><strong>License Number:</strong> ${licenseNumber || 'Not provided'}</p>
              <p style="margin: 0;"><strong>Video Duration:</strong> ${recordingTime || 0} seconds</p>
            </div>

            <p style="margin: 0 0 12px;">We will review your submission and get back to you within 1-2 business days.</p>
            <p style="margin: 0 0 12px;">If you have any questions or need assistance, please don't hesitate to contact us.</p>
            
            <p style="margin-top: 20px; font-size: 12px; color: #777;">
              Best regards,<br>
              QuickShift Team
            </p>
          </div>
        </div>
      `
    });

    console.log("Services user email sent: %s", userInfo.messageId);
    return { success: true };
  } catch (error) {
    console.error("Error sending services email", error);
    return { success: false, error };
  }
};
