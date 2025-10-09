import nodemailer from 'nodemailer';

// Create reusable transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface SendVerificationEmailParams {
  to: string;
  name: string;
  token: string;
}

export async function sendVerificationEmail({
  to,
  name,
  token,
}: SendVerificationEmailParams): Promise<void> {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;

  const mailOptions = {
    from: '"UmojaHub" <noreply@umojahub.com>',
    to,
    subject: 'Verify your UmojaHub account',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 40px 20px; text-align: center;">
                    <h1 style="margin: 0; color: #16a34a; font-size: 28px;">UmojaHub</h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 20px 40px;">
                    <h2 style="margin: 0 0 20px; color: #333333; font-size: 24px;">Hi ${name},</h2>
                    <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.5;">
                      Welcome to UmojaHub!
                    </p>
                    <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.5;">
                      Please confirm your email to activate your account.
                    </p>
                    <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.5;">
                      Click the button below to verify your account:
                    </p>
                    
                    <!-- Button -->
                    <table role="presentation" style="margin: 0 auto;">
                      <tr>
                        <td style="border-radius: 6px; background-color: #16a34a;">
                          <a href="${verificationUrl}" target="_blank" style="display: inline-block; padding: 16px 36px; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">
                            Verify My Account
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 30px 0 0; color: #999999; font-size: 14px; line-height: 1.5;">
                      Or copy and paste this link in your browser:<br>
                      <a href="${verificationUrl}" style="color: #16a34a; word-break: break-all;">${verificationUrl}</a>
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 20px 40px 40px; border-top: 1px solid #eeeeee;">
                    <p style="margin: 0; color: #999999; font-size: 14px; line-height: 1.5;">
                      If you didn't create this account, you can ignore this email.
                    </p>
                    <p style="margin: 20px 0 0; color: #999999; font-size: 12px; line-height: 1.5;">
                      This verification link will expire in 30 minutes.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}

interface SendResendVerificationEmailParams {
  to: string;
  name: string;
  token: string;
}

export async function sendResendVerificationEmail({
  to,
  name,
  token,
}: SendResendVerificationEmailParams): Promise<void> {
  return sendVerificationEmail({ to, name, token });
}
