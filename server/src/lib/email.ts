// ─── Email service (Resend) ────────────────────────────────────────────────────
// Uses the Resend HTTP API directly — no SDK dependency needed.
// To enable: set RESEND_API_KEY and FROM_EMAIL in your .env
//
// Usage:
//   import { sendPasswordResetEmail } from "../lib/email.js";
//   await sendPasswordResetEmail({ to: user.email, name: user.name, resetUrl });

import logger from "./logger.js";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL     = process.env.FROM_EMAIL ?? "CreatorForge <noreply@creatorforge.io>";
const CLIENT_URL     = process.env.CLIENT_URL ?? "http://localhost:5173";

// ─── Low-level send ───────────────────────────────────────────────────────────
async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  if (!RESEND_API_KEY) {
    // In development without a key: just log so you can see the email content
    logger.warn("RESEND_API_KEY not set — email not sent", { to, subject });
    logger.debug("Email HTML preview", html);
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend API error ${res.status}: ${body}`);
  }
}

// ─── Password reset email ─────────────────────────────────────────────────────
export async function sendPasswordResetEmail({
  to,
  name,
  token,
}: {
  to: string;
  name: string;
  token: string;             // the RAW (unhashed) token — user clicks this in the link
}): Promise<void> {
  const resetUrl = `${CLIENT_URL}/reset-password?token=${token}`;
  const firstName = name.split(" ")[0];

  await sendEmail({
    to,
    subject: "Reset your CreatorForge password",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { margin: 0; padding: 0; background: #0a0b0f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #e8e8e0; }
    .container { max-width: 520px; margin: 40px auto; padding: 0 20px; }
    .card { background: #111318; border: 1px solid #1f2330; border-radius: 16px; padding: 40px; }
    .logo { display: flex; align-items: center; gap: 10px; margin-bottom: 32px; }
    .logo-icon { width: 32px; height: 32px; background: #f59e0b; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
    .logo-text { font-weight: 700; font-size: 17px; color: #e8e8e0; letter-spacing: -0.3px; }
    h1 { margin: 0 0 12px; font-size: 22px; font-weight: 700; color: #e8e8e0; }
    p { margin: 0 0 20px; font-size: 15px; line-height: 1.6; color: #8a8f9e; }
    .btn { display: inline-block; padding: 14px 28px; background: #f59e0b; color: #0a0b0f; border-radius: 10px; font-weight: 700; font-size: 15px; text-decoration: none; letter-spacing: -0.2px; }
    .expiry { margin-top: 24px; font-size: 13px; color: #4a4f5e; }
    .url-fallback { margin-top: 16px; font-size: 12px; color: #4a4f5e; word-break: break-all; }
    .divider { border: none; border-top: 1px solid #1f2330; margin: 28px 0; }
    .footer { margin-top: 24px; font-size: 12px; color: #4a4f5e; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="logo">
        <div class="logo-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" fill="#0a0b0f" stroke="#0a0b0f" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="logo-text">CreatorForge</span>
      </div>

      <h1>Reset your password</h1>
      <p>Hey ${firstName}, we got a request to reset your CreatorForge password. Click the button below — the link expires in <strong style="color: #e8e8e0">1 hour</strong>.</p>

      <a href="${resetUrl}" class="btn">Reset password</a>

      <p class="expiry">If you didn't request this, you can safely ignore this email. Your password won't change.</p>

      <hr class="divider" />

      <p class="url-fallback">
        If the button doesn't work, copy and paste this link into your browser:<br/>
        <a href="${resetUrl}" style="color: #f59e0b">${resetUrl}</a>
      </p>
    </div>
    <div class="footer">© ${new Date().getFullYear()} CreatorForge · This is an automated message</div>
  </div>
</body>
</html>
    `.trim(),
  });
}

// ─── Welcome email (called on signup) ────────────────────────────────────────
// Phase 2 will flesh this out; stub it here so Phase 1 auth controller can import it.
export async function sendWelcomeEmail({
  to,
  name,
  username,
}: {
  to: string;
  name: string;
  username: string;
}): Promise<void> {
  const pageUrl = `${CLIENT_URL}/${username}`;
  const firstName = name.split(" ")[0];

  await sendEmail({
    to,
    subject: "Welcome to CreatorForge ⚡",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { margin: 0; padding: 0; background: #0a0b0f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #e8e8e0; }
    .container { max-width: 520px; margin: 40px auto; padding: 0 20px; }
    .card { background: #111318; border: 1px solid #1f2330; border-radius: 16px; padding: 40px; }
    h1 { margin: 0 0 12px; font-size: 22px; font-weight: 700; }
    p { margin: 0 0 20px; font-size: 15px; line-height: 1.6; color: #8a8f9e; }
    .btn { display: inline-block; padding: 14px 28px; background: #f59e0b; color: #0a0b0f; border-radius: 10px; font-weight: 700; font-size: 15px; text-decoration: none; }
    .footer { margin-top: 24px; font-size: 12px; color: #4a4f5e; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <h1>Welcome, ${firstName} ⚡</h1>
      <p>Your CreatorForge page is live at <a href="${pageUrl}" style="color: #f59e0b">@${username}</a>. Go to your dashboard to add links, set up subscription tiers, and start earning.</p>
      <a href="${CLIENT_URL}/dashboard" class="btn">Open dashboard</a>
    </div>
    <div class="footer">© ${new Date().getFullYear()} CreatorForge</div>
  </div>
</body>
</html>
    `.trim(),
  });
}