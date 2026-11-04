import { ICreateAccount, IResetPassword } from "../types/emailTamplate";

const createAccount = (values: ICreateAccount) => {
  const data = {
    to: values.email,
    subject: `${process.env.APP_NAME} - Email Verification Code`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;
                  padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #333; text-align: center;">Verify Your Email</h2>
        
        <p style="font-size: 15px; color: #555;">
          Welcome to <strong>${process.env.APP_NAME}</strong>! To complete your registration, 
          please enter the verification code below:
        </p>
        
        <div style="background: #f5f5f5; padding: 15px; margin: 20px 0; 
                    text-align: center; border-radius: 6px;">
          <strong style="font-size: 26px; letter-spacing: 3px; color: #333;">
            ${values.otp}
          </strong>
        </div>
        
        <p style="font-size: 14px; color: #555;">
          This code will expire in <strong>5 minutes</strong>.
        </p>
        
        <p style="color: #666; font-size: 13px; margin-top: 25px;">
          If you didn’t request this, you can safely ignore this email or contact support at 
          <a href="mailto:${process.env.SUPPORT_EMAIL}" 
             style="color: #0073e6; text-decoration: none;">
             ${process.env.SUPPORT_EMAIL}
          </a>.
        </p>
        
        <p style="margin-top: 30px; font-size: 14px; color: #333;">
          Thanks,<br>
          The ${process.env.APP_NAME} Team
        </p>
      </div>
    `,
    text: `
      Verify Your Email

      Welcome to ${process.env.APP_NAME}! 
      Your verification code is: ${values.otp}

      This code will expire in 5 minutes.

      If you didn’t request this, ignore this email or contact support: ${process.env.SUPPORT_EMAIL}

      Thanks,
      The ${process.env.APP_NAME} Team
    `,
  };
  return data;
};

// delete account
const deleteAccount = (values: ICreateAccount) => {
  const data = {
    to: values.email,
    subject: `${process.env.APP_NAME} - Account Deletion Verification`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; 
                  padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        
        <!-- Header -->
        <div style="background: #dc2626; padding: 20px; text-align: center; 
                    border-radius: 8px 8px 0 0; margin: -20px -20px 20px -20px;">
          <h2 style="color: #ffffff; margin: 0; font-size: 24px;">
            ⚠️ Account Deletion Request
          </h2>
        </div>
        
        <p style="font-size: 15px; color: #555; line-height: 1.6;">
          Hello <strong>${values.name}</strong>,
        </p>
        
        <p style="font-size: 15px; color: #555; line-height: 1.6;">
          We received a request to permanently delete your <strong>${process.env.APP_NAME}</strong> account. 
          This action is <strong style="color: #dc2626;">irreversible</strong> and will result in:
        </p>
        
        <ul style="color: #555; font-size: 14px; line-height: 1.8; padding-left: 20px;">
          <li>Permanent loss of all your data</li>
          <li>Removal of all your posts, comments, and activities</li>
          <li>Loss of access to your account forever</li>
        </ul>
        
        <!-- OTP Section -->
        <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 15px; 
                    margin: 25px 0; text-align: center; border-radius: 6px;">
          <p style="margin: 0 0 10px 0; color: #991b1b; font-size: 14px; font-weight: bold;">
            Verification Code
          </p>
          <strong style="font-size: 32px; letter-spacing: 4px; color: #dc2626;">
            ${values.otp}
          </strong>
        </div>
        
        <p style="font-size: 14px; color: #666;">
          ⏰ This code will expire in <strong>5 minutes</strong>.
        </p>
        
        <div style="background: #fff3cd; border: 1px solid #ffeeba; padding: 12px; 
                    margin: 20px 0; border-radius: 6px;">
          <p style="margin: 0; font-size: 13px; color: #856404;">
            <strong>⚠️ Important:</strong> If you did not request this, 
            please reset your password immediately and contact support.
          </p>
        </div>
        
        <p style="color: #666; font-size: 13px; margin-top: 25px;">
          For any questions, contact us at 
          <a href="mailto:${process.env.SUPPORT_EMAIL}" 
             style="color: #2563eb; text-decoration: none;">
             ${process.env.SUPPORT_EMAIL}
          </a>
        </p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0 15px 0;" />
        
        <p style="margin: 0; font-size: 13px; color: #999; text-align: center;">
          © ${new Date().getFullYear()} ${process.env.APP_NAME}. All rights reserved.
        </p>
      </div>
    `,
    text: `
      ⚠️ Account Deletion Request

      Hello ${values.name},

      We received a request to permanently delete your ${process.env.APP_NAME} account.

      This action is IRREVERSIBLE and will result in:
      - Permanent loss of all your data
      - Removal of all your posts, comments, and activities
      - Loss of access to your account forever

      Your verification code is: ${values.otp}

      This code will expire in 5 minutes.

      ⚠️ Important: If you did not request this, please reset your password immediately.

      For any questions, contact us at: ${process.env.SUPPORT_EMAIL}

      Thanks,
      The ${process.env.APP_NAME} Team

      © ${new Date().getFullYear()} ${process.env.APP_NAME}. All rights reserved.
    `,
  };
  return data;
};

export const resetPasswordEmail = (values: IResetPassword) => {
  const data = {
    to: values.email,
    subject: `${process.env.APP_NAME} - Password Reset Request`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>We received a request to reset your password for your ${process.env.APP_NAME} account.</p>
        
        <div style="background: #f5f5f5; padding: 15px; margin: 20px 0; text-align: center;">
          <strong style="font-size: 24px; letter-spacing: 2px;">${values.otp}</strong>
        </div>
        
        <p>This verification code will expire in <strong>5 minutes</strong>.</p>
        
        <p style="color: #666; font-size: 14px;">
          If you didn't request this, please ignore this email or contact support at 
          <a href="mailto:${process.env.SUPPORT_EMAIL}">${process.env.SUPPORT_EMAIL}</a>.
        </p>
        
        <p>Thanks,<br>The ${process.env.APP_NAME} Team</p>
      </div>
    `,
    text: `
      Password Reset Request\n\n
      We received a request to reset your password for your ${process.env.APP_NAME} account.\n\n
      Your verification code is: ${values.otp}\n\n
      This code will expire in 5 minutes.\n\n
      If you didn't request this, please ignore this email.\n\n
      Thanks,\nThe ${process.env.APP_NAME} Team
    `,
  };
  return data;
};

const createCompany = (values: any) => {
  const data = {
    to: values.clientEmail,
    subject: `${process.env.APP_NAME} - Company Registration Verification`,
    html: `<div style=" font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e5e5; border-radius: 10px; overflow: hidden; "> <!-- Header --> <div style=" background: #111827; padding: 30px; text-align: center; "> <h1 style=" color: #ffffff; margin: 0; font-size: 28px; "> ${process.env.APP_NAME} </h1> <p style=" color: #d1d5db; margin-top: 10px; font-size: 14px; "> Company Registration Verification </p> </div> <!-- Body --> <div style="padding: 35px;"> <p style=" font-size: 16px; color: #374151; margin-bottom: 20px; "> Hello <strong>${values.clientName}</strong>, </p> <p style=" font-size: 15px; color: #4b5563; line-height: 1.7; "> A new company registration request has been submitted on <strong>${process.env.APP_NAME}</strong>. Please verify the request using the verification code below. </p> <!-- Company Info --> <div style=" background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 25px 0; "> <h3 style=" margin-top: 0; margin-bottom: 15px; color: #111827; "> Company Details </h3> <p style="margin: 8px 0; color: #374151;"> <strong>Company Name:</strong> ${values.companyName} </p> <p style="margin: 8px 0; color: #374151;"> <strong>Company Email:</strong> ${values.companyEmail} </p> <p style="margin: 8px 0; color: #374151;"> <strong>Company Phone:</strong> ${values.companyPhone} </p> </div> <!-- OTP --> <div style=" text-align: center; margin: 35px 0; "> <p style=" font-size: 14px; color: #6b7280; margin-bottom: 12px; "> Your Verification Code </p> <div style=" display: inline-block; background: #111827; color: #ffffff; padding: 16px 35px; border-radius: 10px; font-size: 32px; letter-spacing: 6px; font-weight: bold; "> ${values.otp} </div> </div> <p style=" font-size: 14px; color: #ef4444; margin-top: 20px; "> This verification code will expire in <strong>5 minutes</strong>. </p> <p style=" font-size: 14px; color: #6b7280; line-height: 1.6; margin-top: 25px; "> If you did not request this registration, please ignore this email or contact our support team immediately at <a href="mailto:${process.env.SUPPORT_EMAIL}" style=" color: #2563eb; text-decoration: none; " > ${process.env.SUPPORT_EMAIL} </a>. </p> <p style=" margin-top: 35px; font-size: 15px; color: #374151; "> Best Regards,<br /> <strong>The ${process.env.APP_NAME} Team</strong> </p> </div> <!-- Footer --> <div style=" background: #f3f4f6; padding: 18px; text-align: center; font-size: 12px; color: #6b7280; "> © ${new Date().getFullYear()} ${process.env.APP_NAME}. All rights reserved. </div> </div> `,
    text: `Company Registration Verification Hello ${values.clientName}, A new company registration request has been submitted on ${process.env.APP_NAME}. Company Details: - Company Name: ${values.companyName} - Company Email: ${values.companyEmail} - Company Phone: ${values.companyPhone} Your verification code is: ${values.otp} This code will expire in 5 minutes. If you did not request this registration, please contact support: ${process.env.SUPPORT_EMAIL} Best Regards, The ${process.env.APP_NAME} Team `,
  };
  return data;
};

const immediateActionEmail = (values: any) => {
  const data = {
    to: values.email,
    subject: `${process.env.APP_NAME} - Immediate Action Required`,
    html: ``,
    text: ``,
  };
  return data;
};

export const clinicOnboardingEmail = (values: {
  email: string;
  adminName: string;
  temporaryPassword: string;
  checkoutUrl?: string;
  clinicName: string;
  isSelfServe: boolean;
  frontendBaseUrl: any;
}) => {
  const {
    email,
    adminName,
    temporaryPassword,
    checkoutUrl = "",
    clinicName,
    isSelfServe,
    frontendBaseUrl,
  } = values;

  const loginUrl = `${frontendBaseUrl}/login`;

  const paymentSection = isSelfServe
    ? `
      <h3>Complete Your Payment</h3>

      <p>
        To activate your clinic workspace, please complete your payment
        using the button below.
      </p>

      <div style="text-align: center; margin: 25px 0;">
        <a
          href="${checkoutUrl}"
          style="
            display: inline-block;
            padding: 12px 24px;
            background: #1FA463;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
          "
        >
          Proceed to Payment
        </a>
      </div>

      <p style="font-size: 14px; color: #666;">
        Your clinic workspace will be activated after successful payment.
      </p>
    `
    : `
      <div
        style="
          background: #EBF4FF;
          padding: 15px;
          border-radius: 5px;
          border-left: 4px solid #3B82F6;
          margin: 20px 0;
        "
      >
        <h3>Enterprise Plan - Next Steps</h3>

        <p>
          You have selected our Enterprise plan. Our sales team will contact
          you shortly to finalize your contract and billing setup.
        </p>

        <p>
          You can log in to your account using the temporary password below
          while we complete the onboarding process.
        </p>
      </div>
    `;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />

        <style>
          body {
            margin: 0;
            padding: 0;
            background: #f5f5f5;
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.6;
            color: #333;
          }

          .container {
            max-width: 600px;
            margin: 30px auto;
            padding: 20px;
          }

          .header {
            background: #1FA463;
            padding: 25px;
            color: #ffffff;
            border-radius: 8px 8px 0 0;
          }

          .header h1 {
            margin: 0;
            font-size: 24px;
          }

          .content {
            padding: 25px;
            background: #ffffff;
          }

          .password-box {
            background: #f9f9f9;
            border: 2px solid #1FA463;
            padding: 18px;
            margin: 20px 0;
            border-radius: 6px;
            text-align: center;
          }

          .password {
            font-size: 24px;
            font-weight: bold;
            color: #1FA463;
            letter-spacing: 2px;
            margin-top: 10px;
          }

          .warning {
            background: #FCEED9;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #F5A623;
            margin: 20px 0;
          }

          .footer {
            margin-top: 0;
            padding: 20px;
            background: #f9f9f9;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
            border-radius: 0 0 8px 8px;
          }

          .login-button {
            display: inline-block;
            padding: 12px 24px;
            background: #1FA463;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
          }

          a {
            color: #1FA463;
          }
        </style>
      </head>

      <body>
        <div class="container">

          <div class="header">
            <h1>Welcome, ${adminName}!</h1>
          </div>

          <div class="content">

            <h2>Your Clinic Account Has Been Created</h2>

            <p>
              Congratulations! Your clinic
              <strong>${clinicName}</strong>
              has been successfully onboarded.
            </p>

            <h3>Your Login Details</h3>

            <p>
              Your administrator account has been created using:
            </p>

            <p>
              <strong>Email:</strong> ${email}
            </p>

            <h3>Temporary Password</h3>

            <div class="password-box">
              <p>
                Use the following temporary password to log in:
              </p>

              <div class="password">
                ${temporaryPassword}
              </div>
            </div>

            <div class="warning">
              <strong>Important:</strong>

              <ul>
                <li>This temporary password is valid for 24 hours only.</li>
                <li>You will be required to change your password after login.</li>
                <li>Please keep this password secure.</li>
                <li>Do not share your password with anyone.</li>
              </ul>
            </div>

            ${paymentSection}

            <h3>Login to Your Account</h3>

            <p>
              You can access your clinic account using the button below:
            </p>

            <div style="text-align: center; margin: 25px 0;">
              <a
                href="${loginUrl}"
                class="login-button"
              >
                Login to Your Account
              </a>
            </div>

            <p>
              Or copy and paste this URL into your browser:
            </p>

            <p>
              <a href="${loginUrl}">
                ${loginUrl}
              </a>
            </p>

            <h4>Need Help?</h4>

            <p>
              If you have any questions or need assistance, please contact
              our support team.
            </p>

            <p>
              📧
              <a href="mailto:support@yourclinic.com">
                support@yourclinic.com
              </a>
              <br />

              📞 +44 (0) 123 456 7890
            </p>

          </div>

          <div class="footer">
            <p>
              This is an automated message. Please do not reply to this email.
            </p>

            <p>
              &copy; ${new Date().getFullYear()}
              Your Clinic Platform. All rights reserved.
            </p>
          </div>

        </div>
      </body>
    </html>
  `;

  const text = `
Welcome to ${process.env.APP_NAME}, ${adminName}!

Your clinic "${clinicName}" has been successfully onboarded.

Login Email:
${email}

Temporary Password:
${temporaryPassword}

Important:
- You will be required to change your password after login.
- Please keep your password secure.
- Do not share your password with anyone.

${isSelfServe
      ? `Complete Your Payment:
${checkoutUrl}

Your clinic workspace will be activated after successful payment.
`
      : `Enterprise Plan:
Our sales team will contact you shortly to finalize your contract and billing setup.
`
    }

Login:
${loginUrl}

Need help?
support@yourclinic.com
+44 (0) 123 456 7890

© ${new Date().getFullYear()} Your Clinic Platform.
  `;

  return {
    to: email,
    subject: `${process.env.APP_NAME} - Welcome to Your New Clinic`,
    html,
    text,
  };
};


export const paymentConfirmationEmail = (values: {
  email: string;
  adminName: string;
  clinicName: string;
  planName?: string;
  amount?: string;
  transactionId?: string;
  paymentDate?: string;
  nextBillingDate?: string;
  frontendBaseUrl?: string;
}) => {
  const {
    email,
    adminName,
    clinicName,
    planName = "Enterprise",
    amount = "$0.00",
    transactionId = "N/A",
    paymentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    nextBillingDate = new Date(
      new Date().setMonth(new Date().getMonth() + 1)
    ).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    frontendBaseUrl = process.env.FRONTEND_URL || "https://app.yourclinic.com",
  } = values;

  const dashboardUrl = `${frontendBaseUrl}/dashboard`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body {
            margin: 0;
            padding: 0;
            background: #f5f5f5;
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.6;
            color: #333;
          }

          .container {
            max-width: 600px;
            margin: 30px auto;
            padding: 20px;
          }

          .header {
            background: #1FA463;
            padding: 25px;
            color: #ffffff;
            border-radius: 8px 8px 0 0;
            text-align: center;
          }

          .header h1 {
            margin: 0;
            font-size: 24px;
          }

          .header .subtitle {
            font-size: 16px;
            opacity: 0.9;
            margin-top: 5px;
          }

          .content {
            padding: 25px;
            background: #ffffff;
          }

          .success-icon {
            text-align: center;
            font-size: 64px;
            margin: 10px 0 20px 0;
          }

          .summary-box {
            background: #f9f9f9;
            border: 2px solid #1FA463;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
          }

          .summary-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
          }

          .summary-item:last-child {
            border-bottom: none;
          }

          .summary-label {
            font-weight: bold;
            color: #555;
          }

          .summary-value {
            color: #1FA463;
            font-weight: bold;
          }

          .plan-badge {
            display: inline-block;
            background: #EBF4FF;
            color: #1FA463;
            padding: 5px 15px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 14px;
          }

          .features-box {
            background: #f0f9f4;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #1FA463;
          }

          .features-box ul {
            margin: 10px 0;
            padding-left: 20px;
          }

          .features-box li {
            margin: 8px 0;
          }

          .button {
            display: inline-block;
            padding: 12px 30px;
            background: #1FA463;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
          }

          .footer {
            margin-top: 0;
            padding: 20px;
            background: #f9f9f9;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
            border-radius: 0 0 8px 8px;
            text-align: center;
          }

          .footer a {
            color: #1FA463;
          }

          .support-info {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #eee;
          }

          @media only screen and (max-width: 480px) {
            .container {
              padding: 10px;
            }

            .summary-item {
              flex-direction: column;
              align-items: flex-start;
              gap: 5px;
            }

            .header h1 {
              font-size: 20px;
            }
          }
        </style>
      </head>

      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Payment Confirmed!</h1>
            <div class="subtitle">
              Welcome to ${process.env.APP_NAME || "Clinic Platform"}, ${adminName}
            </div>
          </div>

          <div class="content">
            <div class="success-icon">✅</div>

            <h2 style="text-align: center; color: #1FA463; margin-top: 0;">
              Your Payment Was Successful
            </h2>

            <p style="text-align: center; font-size: 16px;">
              Thank you for subscribing to the <strong>${planName}</strong> plan
              for <strong>${clinicName}</strong>.
            </p>

            <div class="summary-box">
              <h3 style="margin-top: 0; text-align: center; color: #333;">
                Payment Summary
              </h3>

              <div class="summary-item">
                <span class="summary-label">Plan</span>
                <span class="summary-value">
                  <span class="plan-badge">${planName}</span>
                </span>
              </div>

              <div class="summary-item">
                <span class="summary-label">Amount Paid</span>
                <span class="summary-value">${amount}</span>
              </div>

              <div class="summary-item">
                <span class="summary-label">Transaction ID</span>
                <span class="summary-value" style="font-size: 13px; font-weight: normal; color: #555;">
                  ${transactionId}
                </span>
              </div>

              <div class="summary-item">
                <span class="summary-label">Payment Date</span>
                <span class="summary-value">${paymentDate}</span>
              </div>

              <div class="summary-item">
                <span class="summary-label">Next Billing Date</span>
                <span class="summary-value">${nextBillingDate}</span>
              </div>
            </div>

            <div class="features-box">
              <h3 style="margin-top: 0; color: #1FA463;">✨ What's Included in Your Plan</h3>
              <p>Your clinic now has access to the following features:</p>
              <ul>
                <li><strong>Complete Clinic Management Dashboard</strong></li>
                <li><strong>Patient Management System</strong></li>
                <li><strong>Appointment Scheduling</strong></li>
                <li><strong>Billing &amp; Invoicing</strong></li>
                <li><strong>24/7 Priority Support</strong></li>
                <li><strong>Secure Data Storage</strong></li>
              </ul>
            </div>

            <h3 style="margin-top: 25px;">🚀 Getting Started</h3>
            <p>
              Your clinic workspace is now fully activated. Log in to your
              account to start managing your clinic.
            </p>

            <div style="text-align: center; margin: 25px 0;">
              <a href="${dashboardUrl}" class="button">
                Go to Dashboard
              </a>
            </div>

            <p style="text-align: center; font-size: 14px; color: #666;">
              Or visit: <a href="${dashboardUrl}">${dashboardUrl}</a>
            </p>

            <div class="support-info">
              <h4>📞 Need Help?</h4>
              <p>
                If you have any questions or need assistance getting started,
                our support team is here to help.
              </p>
              <p>
                📧 <a href="mailto:support@yourclinic.com">support@yourclinic.com</a>
                <br />
                📞 +44 (0) 123 456 7890
              </p>
            </div>
          </div>

          <div class="footer">
            <p>
              This email confirms your payment to
              ${process.env.APP_NAME || "Your Clinic Platform"}.
            </p>
            <p>
              &copy; ${new Date().getFullYear()}
              ${process.env.APP_NAME || "Your Clinic Platform"}.
              All rights reserved.
            </p>
            <p style="font-size: 11px; color: #999;">
              This is an automated message. Please do not reply to this email.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
${process.env.APP_NAME || "Clinic Platform"} - Payment Confirmation
====================================================================

Dear ${adminName},

✅ Your payment has been confirmed successfully!

Thank you for subscribing to the ${planName} plan for your clinic "${clinicName}".
Your clinic workspace is now fully activated.

─────────────────────────────────────────────────────────────────────
Payment Summary
─────────────────────────────────────────────────────────────────────

Plan:              ${planName}
Amount Paid:       ${amount}
Transaction ID:    ${transactionId}
Payment Date:      ${paymentDate}
Next Billing Date: ${nextBillingDate}

─────────────────────────────────────────────────────────────────────
What's Included in Your Plan
─────────────────────────────────────────────────────────────────────

✓ Complete Clinic Management Dashboard
✓ Patient Management System
✓ Appointment Scheduling
✓ Billing & Invoicing
✓ 24/7 Priority Support
✓ Secure Data Storage

─────────────────────────────────────────────────────────────────────
Getting Started
─────────────────────────────────────────────────────────────────────

Login to your dashboard to start managing your clinic:
${dashboardUrl}

─────────────────────────────────────────────────────────────────────
Need Help?
─────────────────────────────────────────────────────────────────────

📧 support@yourclinic.com
📞 +44 (0) 123 456 7890

We're here to help you every step of the way!

─────────────────────────────────────────────────────────────────────
© ${new Date().getFullYear()} ${process.env.APP_NAME || "Your Clinic Platform"}.
This is an automated message. Please do not reply to this email.
`;

  return {
    to: email,
    subject: `${process.env.APP_NAME || "Clinic Platform"} - Payment Confirmation 🎉`,
    html,
    text,
  };
};

export const emailTemplate = {
  createAccount,
  deleteAccount,
  createCompany,
  immediateActionEmail,
  resetPassword: resetPasswordEmail,
};





