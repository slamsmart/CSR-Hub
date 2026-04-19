const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

type EmailTemplateParams = Record<string, string | number | boolean | null | undefined>;

function getRequiredEmailJsConfig() {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey) {
    return null;
  }

  return {
    serviceId,
    templateId,
    publicKey,
    privateKey,
  };
}

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

export function isEmailDeliveryConfigured() {
  return Boolean(getRequiredEmailJsConfig());
}

export async function sendEmailJsTemplate(templateParams: EmailTemplateParams) {
  const config = getRequiredEmailJsConfig();

  if (!config) {
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
      template_id: config.templateId,
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

  return sendEmailJsTemplate({
    email,
    to_email: email,
    name,
    to_name: name,
    subject: "Verify your CSR Hub account",
    heading: "Verify your email address",
    message: `Hi ${name}, please verify your CSR Hub account to keep your registration secure and activate your email status.`,
    action_url: verificationUrl,
    action_label: "Verify Email",
    app_name: process.env.NEXT_PUBLIC_APP_NAME || "CSR Hub",
    support_email: process.env.SMTP_FROM || email,
    verification_url: verificationUrl,
  });
}
