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
            <p style="margin: 0 0 12px;">You’ve received a new message from your website contact form:</p>
            
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
              This message was sent from your website’s contact form.
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
