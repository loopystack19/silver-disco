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

interface SendEmailParams {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

/**
 * Generic email sending function
 */
export async function sendEmail({
  to,
  subject,
  text,
  html,
}: SendEmailParams): Promise<void> {
  const mailOptions = {
    from: '"UmojaHub" <noreply@umojahub.com>',
    to,
    subject,
    text,
    html: html || text,
  };

  await transporter.sendMail(mailOptions);
}

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

interface SendVerificationCodeParams {
  to: string;
  name: string;
  code: string;
}

export async function sendVerificationCode({
  to,
  name,
  code,
}: SendVerificationCodeParams): Promise<void> {
  const mailOptions = {
    from: '"UmojaHub" <noreply@umojahub.com>',
    to,
    subject: 'UmojaHub Email Verification',
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
                    <h2 style="margin: 0 0 20px; color: #333333; font-size: 24px;">Hello ${name},</h2>
                    <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.5;">
                      Welcome to UmojaHub!
                    </p>
                    <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.5;">
                      Your verification code is:
                    </p>

                    <!-- Verification Code Display -->
                    <div style="background-color: #f8f9fa; border: 2px dashed #16a34a; border-radius: 8px; padding: 30px; text-align: center; margin: 0 0 30px;">
                      <div style="font-size: 36px; font-weight: bold; color: #16a34a; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                        ${code}
                      </div>
                    </div>

                    <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.5;">
                      Enter this code on the verification page to activate your account.
                    </p>

                    <p style="margin: 0 0 0; color: #999999; font-size: 14px; line-height: 1.5;">
                      This code will expire in 10 minutes.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 20px 40px 40px; border-top: 1px solid #eeeeee;">
                    <p style="margin: 0; color: #999999; font-size: 14px; line-height: 1.5;">
                      If you didn't request this code, you can safely ignore this email.
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

// ===== BUYERS HUB EMAIL FUNCTIONS =====

interface SendOrderConfirmationEmailParams {
  to: string;
  buyerName: string;
  orderId: string;
  cropName: string;
  quantity: number;
  unit: string;
  totalAmount: number;
  farmerName: string;
}

export async function sendOrderConfirmationEmail({
  to,
  buyerName,
  orderId,
  cropName,
  quantity,
  unit,
  totalAmount,
  farmerName,
}: SendOrderConfirmationEmailParams): Promise<void> {
  const mailOptions = {
    from: '"UmojaHub Marketplace" <noreply@umojahub.com>',
    to,
    subject: 'Order Confirmation - UmojaHub',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
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
                    <p style="margin: 10px 0 0; color: #666666; font-size: 14px;">Marketplace</p>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 20px 40px;">
                    <h2 style="margin: 0 0 20px; color: #333333; font-size: 24px;">Order Confirmed!</h2>
                    <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.5;">
                      Hi ${buyerName},
                    </p>
                    <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.5;">
                      Your order has been confirmed and is being processed. Here are your order details:
                    </p>

                    <!-- Order Details Box -->
                    <div style="background-color: #f8f9fa; border-left: 4px solid #16a34a; padding: 20px; margin: 0 0 30px;">
                      <p style="margin: 0 0 10px; color: #333333; font-size: 14px;">
                        <strong>Order ID:</strong> ${orderId}
                      </p>
                      <p style="margin: 0 0 10px; color: #333333; font-size: 14px;">
                        <strong>Product:</strong> ${cropName}
                      </p>
                      <p style="margin: 0 0 10px; color: #333333; font-size: 14px;">
                        <strong>Quantity:</strong> ${quantity} ${unit}
                      </p>
                      <p style="margin: 0 0 10px; color: #333333; font-size: 14px;">
                        <strong>Farmer:</strong> ${farmerName}
                      </p>
                      <p style="margin: 0; color: #333333; font-size: 18px; font-weight: bold;">
                        <strong>Total:</strong> KSh ${totalAmount.toLocaleString()}
                      </p>
                    </div>

                    <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.5;">
                      You will receive updates on your order status via email. You can also track your order in your dashboard.
                    </p>

                    <!-- Button -->
                    <table role="presentation" style="margin: 0 auto;">
                      <tr>
                        <td style="border-radius: 6px; background-color: #16a34a;">
                          <a href="${process.env.NEXTAUTH_URL}/dashboard/buyers/orders" target="_blank" style="display: inline-block; padding: 16px 36px; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">
                            View Order
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 20px 40px 40px; border-top: 1px solid #eeeeee;">
                    <p style="margin: 0; color: #999999; font-size: 14px; line-height: 1.5;">
                      Thank you for supporting local farmers through UmojaHub!
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

interface SendPaymentSuccessEmailParams {
  to: string;
  buyerName: string;
  orderId: string;
  mpesaReceiptNumber: string;
  amount: number;
}

export async function sendPaymentSuccessEmail({
  to,
  buyerName,
  orderId,
  mpesaReceiptNumber,
  amount,
}: SendPaymentSuccessEmailParams): Promise<void> {
  const mailOptions = {
    from: '"UmojaHub Marketplace" <noreply@umojahub.com>',
    to,
    subject: 'Payment Successful - UmojaHub',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Successful</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <tr>
                  <td style="padding: 40px 40px 20px; text-align: center;">
                    <div style="width: 60px; height: 60px; margin: 0 auto 20px; background-color: #16a34a; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                      <span style="color: white; font-size: 30px;">✓</span>
                    </div>
                    <h1 style="margin: 0; color: #16a34a; font-size: 28px;">Payment Successful!</h1>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 20px 40px;">
                    <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.5;">
                      Hi ${buyerName},
                    </p>
                    <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.5;">
                      Your M-Pesa payment has been received successfully.
                    </p>

                    <div style="background-color: #f8f9fa; border-left: 4px solid #16a34a; padding: 20px; margin: 0 0 30px;">
                      <p style="margin: 0 0 10px; color: #333333; font-size: 14px;">
                        <strong>Order ID:</strong> ${orderId}
                      </p>
                      <p style="margin: 0 0 10px; color: #333333; font-size: 14px;">
                        <strong>M-Pesa Receipt:</strong> ${mpesaReceiptNumber}
                      </p>
                      <p style="margin: 0; color: #333333; font-size: 18px; font-weight: bold;">
                        <strong>Amount Paid:</strong> KSh ${amount.toLocaleString()}
                      </p>
                    </div>

                    <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.5;">
                      Your order is now being prepared for delivery.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 20px 40px 40px; border-top: 1px solid #eeeeee;">
                    <p style="margin: 0; color: #999999; font-size: 14px; line-height: 1.5;">
                      Thank you for your purchase!
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

interface SendOrderStatusUpdateEmailParams {
  to: string;
  buyerName: string;
  orderId: string;
  status: string;
  statusMessage: string;
}

export async function sendOrderStatusUpdateEmail({
  to,
  buyerName,
  orderId,
  status,
  statusMessage,
}: SendOrderStatusUpdateEmailParams): Promise<void> {
  const statusColors: Record<string, string> = {
    confirmed: '#2563eb',
    shipped: '#ea580c',
    completed: '#16a34a',
    cancelled: '#dc2626',
  };

  const statusColor = statusColors[status] || '#666666';

  const mailOptions = {
    from: '"UmojaHub Marketplace" <noreply@umojahub.com>',
    to,
    subject: `Order Update: ${status.charAt(0).toUpperCase() + status.slice(1)} - UmojaHub`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Status Update</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <tr>
                  <td style="padding: 40px 40px 20px; text-align: center;">
                    <h1 style="margin: 0; color: ${statusColor}; font-size: 28px;">Order ${status.charAt(0).toUpperCase() + status.slice(1)}</h1>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 20px 40px;">
                    <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.5;">
                      Hi ${buyerName},
                    </p>
                    <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.5;">
                      ${statusMessage}
                    </p>

                    <div style="background-color: #f8f9fa; border-left: 4px solid ${statusColor}; padding: 20px; margin: 0 0 30px;">
                      <p style="margin: 0; color: #333333; font-size: 14px;">
                        <strong>Order ID:</strong> ${orderId}
                      </p>
                    </div>

                    <table role="presentation" style="margin: 0 auto;">
                      <tr>
                        <td style="border-radius: 6px; background-color: #16a34a;">
                          <a href="${process.env.NEXTAUTH_URL}/dashboard/buyers/orders/${orderId}" target="_blank" style="display: inline-block; padding: 16px 36px; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">
                            View Order Details
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 20px 40px 40px; border-top: 1px solid #eeeeee;">
                    <p style="margin: 0; color: #999999; font-size: 14px; line-height: 1.5;">
                      Thank you for using UmojaHub!
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
