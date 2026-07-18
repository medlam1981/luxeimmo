/**
 * Resend email service helper.
 * Provides a strongly-typed wrapper around the Resend client
 * with graceful degradation when the API key is missing.
 */

import { Resend } from 'resend';

// Initialise lazily so the module doesn't throw at import time
// if the env variable is missing (e.g. during unit tests).
let resendClient: Resend | null = null;

function getResend(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error(
        'RESEND_API_KEY is not set. Add it to your .env file to enable email notifications.'
      );
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

export interface ContactInquiryEmailPayload {
  propertyTitle: string;
  propertySlug: string;
  propertyCity: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  message: string;
  inquiryId: string;
}

/**
 * Builds a polished HTML email body for the admin notification.
 */
function buildAdminEmailHtml(data: ContactInquiryEmailPayload): string {
  const BASE_URL = process.env.NEXTAUTH_URL || 'https://luxeimmo.com';
  const propertyUrl = `${BASE_URL}/en/properties/${data.propertySlug}`;
  const now = new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  return /* html */ `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Property Inquiry — LuxeImmo</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="600" cellpadding="0" cellspacing="0" border="0"
          style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:600px;">

          <!-- Header -->
          <tr>
            <td style="background:#0a0a0a;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">
                🏠 LuxeImmo
              </h1>
              <p style="margin:8px 0 0;color:#a1a1aa;font-size:13px;">Property Management Platform</p>
            </td>
          </tr>

          <!-- Alert banner -->
          <tr>
            <td style="background:#18181b;padding:16px 40px;text-align:center;">
              <p style="margin:0;color:#fbbf24;font-size:14px;font-weight:600;letter-spacing:0.5px;">
                ⚡ NEW INQUIRY RECEIVED
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">

              <p style="margin:0 0 24px;color:#3f3f46;font-size:15px;line-height:1.6;">
                A potential client has expressed interest in one of your listings. 
                Their details are summarised below.
              </p>

              <!-- Property section -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                style="background:#fafafa;border:1px solid #e4e4e7;border-radius:12px;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 4px;font-size:11px;color:#71717a;font-weight:600;text-transform:uppercase;letter-spacing:1px;">
                      Property
                    </p>
                    <p style="margin:0 0 12px;font-size:18px;font-weight:700;color:#0a0a0a;">
                      ${escapeHtml(data.propertyTitle)}
                    </p>
                    <p style="margin:0 0 16px;font-size:14px;color:#52525b;">
                      📍 ${escapeHtml(data.propertyCity)}, Morocco
                    </p>
                    <a href="${propertyUrl}"
                      style="display:inline-block;background:#0a0a0a;color:#ffffff;text-decoration:none;
                             padding:10px 20px;border-radius:8px;font-size:13px;font-weight:600;">
                      View Listing →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Sender details -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                style="background:#fafafa;border:1px solid #e4e4e7;border-radius:12px;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 16px;font-size:11px;color:#71717a;font-weight:600;
                               text-transform:uppercase;letter-spacing:1px;">
                      Client Information
                    </p>

                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #e4e4e7;">
                          <span style="font-size:13px;color:#71717a;width:80px;display:inline-block;">Name</span>
                          <span style="font-size:14px;color:#0a0a0a;font-weight:600;">${escapeHtml(data.senderName)}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #e4e4e7;">
                          <span style="font-size:13px;color:#71717a;width:80px;display:inline-block;">Email</span>
                          <a href="mailto:${escapeHtml(data.senderEmail)}"
                            style="font-size:14px;color:#2563eb;font-weight:600;text-decoration:none;">
                            ${escapeHtml(data.senderEmail)}
                          </a>
                        </td>
                      </tr>
                      ${data.senderPhone ? `
                      <tr>
                        <td style="padding:8px 0;">
                          <span style="font-size:13px;color:#71717a;width:80px;display:inline-block;">Phone</span>
                          <a href="tel:${escapeHtml(data.senderPhone)}"
                            style="font-size:14px;color:#2563eb;font-weight:600;text-decoration:none;">
                            ${escapeHtml(data.senderPhone)}
                          </a>
                        </td>
                      </tr>` : ''}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Message -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;margin-bottom:32px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 12px;font-size:11px;color:#92400e;font-weight:600;
                               text-transform:uppercase;letter-spacing:1px;">
                      💬 Their Message
                    </p>
                    <p style="margin:0;font-size:15px;color:#1c1917;line-height:1.7;white-space:pre-line;">
                      ${escapeHtml(data.message)}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <a href="mailto:${escapeHtml(data.senderEmail)}?subject=Re: Your inquiry about ${encodeURIComponent(data.propertyTitle)}"
                      style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;
                             padding:14px 32px;border-radius:10px;font-size:15px;font-weight:700;
                             box-shadow:0 4px 12px rgba(37,99,235,0.3);">
                      Reply to Client
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#fafafa;border-top:1px solid #e4e4e7;padding:24px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#a1a1aa;">
                Inquiry ID: <code style="font-family:monospace;">${data.inquiryId}</code>
                &nbsp;·&nbsp; Received ${now}
              </p>
              <p style="margin:8px 0 0;font-size:12px;color:#a1a1aa;">
                LuxeImmo — Premium Real Estate Platform &nbsp;·&nbsp;
                <a href="${BASE_URL}" style="color:#71717a;text-decoration:none;">luxeimmo.com</a>
              </p>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>

</body>
</html>`;
}

/** Minimal HTML escaping to prevent XSS in email content. */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Sends an admin notification email for a new contact inquiry.
 * Throws on failure — callers should catch and handle gracefully.
 */
export async function sendContactInquiryEmail(
  data: ContactInquiryEmailPayload
): Promise<void> {
  const resend = getResend();
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    throw new Error('ADMIN_EMAIL is not set. Add it to your .env file.');
  }

  await resend.emails.send({
    from: 'LuxeImmo Notifications <notifications@luxeimmo.com>',
    to: adminEmail,
    replyTo: data.senderEmail,
    subject: `🏠 New Inquiry: "${data.propertyTitle}" — ${data.senderName}`,
    html: buildAdminEmailHtml(data),
  });
}
