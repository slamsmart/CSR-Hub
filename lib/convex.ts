import { ConvexHttpClient } from "convex/browser";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL is not set");
}

/**
 * Server-side Convex HTTP client for use in Next.js API routes and server components.
 * This client makes one-off requests (not reactive subscriptions).
 */
export const convexClient = new ConvexHttpClient(convexUrl);
