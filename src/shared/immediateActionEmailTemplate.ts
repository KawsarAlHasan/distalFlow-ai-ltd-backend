export const immediateActionEmailTemplate = (values: {
  recipientName: string;
  submittedBy: string;
  isAnonymous: boolean;
  rigName: string;
  areaName: string;
  hazardName: string;
  riskSeverity: string;
  description: string;
  actionTaken: boolean;
  submitDay: string;
  cardId: any;
  appName: string;
  appUrl: string;
}) => {
  const {
    recipientName,
    submittedBy,
    isAnonymous,
    rigName,
    areaName,
    hazardName,
    riskSeverity,
    description,
    actionTaken,
    submitDay,
    cardId,
    appName,
    appUrl,
  } = values;

  const severityColor: Record<string, string> = {
    HIGH: { bg: "#fee2e2", text: "#991b1b" },
    MEDIUM: { bg: "#fef3c7", text: "#92400e" },
    LOW: { bg: "#dcfce7", text: "#166534" },
  }[riskSeverity.toUpperCase()] ?? { bg: "#f1f5f9", text: "#334155" };

  const displayName = isAnonymous ? "Anonymous" : submittedBy;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Immediate Action Required</title>
</head>
<body style="margin:0; padding:0; background-color:#f1f5f9; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
          style="background:#ffffff; border-radius:12px; overflow:hidden; border: 1px solid #e2e8f0;">

          <!-- Header -->
          <tr>
            <td style="background:#1a2e44; padding: 32px 40px; text-align:center;">
              <p style="margin:0 0 6px; font-size:24px; font-weight:600; color:#ffffff;">
                ⚠️ Immediate Action Required
              </p>
              <p style="margin:0; font-size:13px; color:#94a3b8;">
                Safety Card Submission Alert — ${appName}
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px 40px;">
              <p style="margin:0 0 16px; font-size:15px; color:#1e293b;">
                Dear <strong>${recipientName}</strong>,
              </p>
              <p style="margin:0 0 24px; font-size:14px; color:#475569; line-height:1.7;">
                A safety hazard card has been submitted that requires your
                <strong style="color:#1e293b;">immediate attention</strong>.
                Please review the details below and take necessary action as soon as possible.
              </p>

              <!-- Summary Box -->
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background:#fff8ed; border:1px solid #f59e0b; border-radius:8px; margin-bottom:20px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <p style="margin:0 0 12px; font-size:11px; font-weight:600;
                      color:#92400e; text-transform:uppercase; letter-spacing:0.5px;">
                      Submission Summary
                    </p>
                    <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;">
                      <tr>
                        <td style="padding:5px 0; color:#92400e; width:40%;">Submitted by</td>
                        <td style="padding:5px 0; color:#78350f; font-weight:600;">${displayName}</td>
                      </tr>
                      <tr>
                        <td style="padding:5px 0; color:#92400e;">Rig / Location</td>
                        <td style="padding:5px 0; color:#78350f; font-weight:600;">${rigName}</td>
                      </tr>
                      <tr>
                        <td style="padding:5px 0; color:#92400e;">Area</td>
                        <td style="padding:5px 0; color:#78350f; font-weight:600;">${areaName}</td>
                      </tr>
                      <tr>
                        <td style="padding:5px 0; color:#92400e;">Hazard Type</td>
                        <td style="padding:5px 0; color:#78350f; font-weight:600;">${hazardName}</td>
                      </tr>
                      <tr>
                        <td style="padding:5px 0; color:#92400e;">Risk Severity</td>
                        <td style="padding:5px 0;">
                          <span style="background:${severityColor.bg}; color:${severityColor.text};
                            font-size:11px; font-weight:600; padding:3px 10px; border-radius:4px;">
                            ${riskSeverity.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:5px 0; color:#92400e;">Submitted on</td>
                        <td style="padding:5px 0; color:#78350f; font-weight:600;">${submitDay}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Description -->
              <table width="100%" cellpadding="0" cellspacing="0"
                style="border:1px solid #e2e8f0; border-radius:8px; margin-bottom:20px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <p style="margin:0 0 8px; font-size:11px; font-weight:600;
                      color:#64748b; text-transform:uppercase; letter-spacing:0.5px;">
                      Description
                    </p>
                    <p style="margin:0; font-size:13px; color:#1e293b; line-height:1.6;">
                      ${description}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Action Status -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td width="48%" style="background:#f0fdf4; border:1px solid #bbf7d0;
                    border-radius:8px; padding:12px 16px;">
                    <p style="margin:0 0 4px; font-size:12px; color:#64748b;">Action taken?</p>
                    <p style="margin:0; font-size:14px; font-weight:600;
                      color:${actionTaken ? "#15803d" : "#b91c1c"};">
                      ${actionTaken ? "Yes" : "No"}
                    </p>
                  </td>
                  <td width="4%"></td>
                  <td width="48%" style="background:#fef2f2; border:1px solid #fecaca;
                    border-radius:8px; padding:12px 16px;">
                    <p style="margin:0 0 4px; font-size:12px; color:#64748b;">Immediate action?</p>
                    <p style="margin:0; font-size:14px; font-weight:600; color:#b91c1c;">
                      Required
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${appUrl}/cards/${cardId}"
                      style="display:inline-block; background:#1a2e44; color:#ffffff;
                        text-decoration:none; padding:13px 36px; border-radius:8px;
                        font-size:14px; font-weight:600;">
                      View Card Details →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top:1px solid #e2e8f0; padding:16px 40px;
              background:#f8fafc; text-align:center;">
              <p style="margin:0; font-size:12px; color:#94a3b8; line-height:1.6;">
                This is an automated alert from <strong style="color:#64748b;">${appName}</strong>.
                Please do not reply to this email.<br/>
                © ${new Date().getFullYear()} ${appName}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `
Immediate Action Required — ${appName}

Dear ${recipientName},

A safety hazard card has been submitted that requires your immediate attention.

Submitted by: ${displayName}
Rig / Location: ${rigName}
Area: ${areaName}
Hazard Type: ${hazardName}
Risk Severity: ${riskSeverity.toUpperCase()}
Submitted on: ${submitDay}

Description:
${description}

Action taken: ${actionTaken ? "Yes" : "No"}
Immediate action: Required

View card: ${appUrl}/cards/${cardId}

---
This is an automated alert from ${appName}. Please do not reply to this email.
`;

  return { html, text };
};
