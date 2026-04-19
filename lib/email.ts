const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

type EmailTemplateParams = Record<string, string | number | boolean | null | undefined>;

function getRecipientName(email: string, name?: string | null) {
  const normalizedName = name?.trim();
  if (normalizedName) {
    return normalizedName;
  }

  return email.split("@")[0] || "there";
}

function getRequiredEmailJsConfig() {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !publicKey || !privateKey) {
    return null;
  }

  return {
    serviceId,
    publicKey,
    privateKey,
  };
}

function getTemplateId(kind: "default" | "otp" | "verification-link" = "default") {
  if (kind === "otp") {
    return process.env.EMAILJS_OTP_TEMPLATE_ID || process.env.EMAILJS_TEMPLATE_ID;
  }

  if (kind === "verification-link") {
    return process.env.EMAILJS_VERIFICATION_TEMPLATE_ID || process.env.EMAILJS_TEMPLATE_ID;
  }

  return process.env.EMAILJS_TEMPLATE_ID;
}

function getBaseUrl() {
  const candidates = [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.NEXTAUTH_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
    "http://localhost:3000",
  ];

  const preferred = candidates.find((value) => {
    if (!value) return false;
    if (process.env.VERCEL && value.includes("localhost")) return false;
    return true;
  });

  return (preferred || "http://localhost:3000").replace(/\/$/, "");
}

export function isEmailDeliveryConfigured() {
  return Boolean(getRequiredEmailJsConfig() && getTemplateId());
}

export async function sendEmailJsTemplate(
  templateParams: EmailTemplateParams,
  options?: { templateId?: string }
) {
  const config = getRequiredEmailJsConfig();
  const templateId = options?.templateId || getTemplateId();

  if (!config || !templateId) {
    console.warn("[Email] EmailJS is not configured. Skipping email delivery.");
    return { skipped: true as const };
  }

  const response = await fetch(EMAILJS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service_id: config.serviceId,
      template_id: templateId,
      user_id: config.publicKey,
      accessToken: config.privateKey,
      template_params: templateParams,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`EmailJS error ${response.status}: ${errorText}`);
  }

  return { skipped: false as const };
}

export async function sendVerificationEmail(email: string, name: string, token: string) {
  const verificationUrl = `${getBaseUrl()}/api/auth/verify-email?token=${encodeURIComponent(token)}`;
  const recipientName = getRecipientName(email, name);

  return sendEmailJsTemplate(
    {
      email,
      to_email: email,
      name: recipientName,
      to_name: recipientName,
      subject: "Verify your CSR Hub account",
      heading: "Verify your email address",
      message: `Hi ${recipientName}, please verify your CSR Hub account to keep your registration secure and activate your email status.`,
      action_url: verificationUrl,
      action_label: "Verify Email",
      app_name: process.env.NEXT_PUBLIC_APP_NAME || "CSR Hub",
      support_email: process.env.SMTP_FROM || email,
      verification_url: verificationUrl,
    },
    { templateId: getTemplateId("verification-link") }
  );
}

export async function sendVerificationOtpEmail(email: string, name: string, otpCode: string) {
  const recipientName = getRecipientName(email, name);

  return sendEmailJsTemplate(
    {
      email,
      to_email: email,
      name: recipientName,
      to_name: recipientName,
      subject: "Your CSR Hub verification code",
      heading: "Verify your email address",
      message: `Hi ${recipientName}, use the verification code below to confirm your CSR Hub account.`,
      otp_code: otpCode,
      action_label: "Verification Code",
      app_name: process.env.NEXT_PUBLIC_APP_NAME || "CSR Hub",
      support_email: process.env.SMTP_FROM || email,
    },
    { templateId: getTemplateId("otp") }
  );
}
