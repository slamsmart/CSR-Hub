import { Metadata } from "next";
import { AIMatchingPage } from "@/components/matching/ai-matching-page";

export const metadata: Metadata = { title: "AI Matching Proposal" };

export default function MatchingPage() {
  return <AIMatchingPage />;
}
