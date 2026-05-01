import { readFileSync } from "node:fs";
import { resolve } from "node:path";

type UsageLike = {
  total_tokens?: unknown;
  prompt_tokens?: unknown;
  completion_tokens?: unknown;
  input_tokens?: unknown;
  output_tokens?: unknown;
};

type Totals = {
  filesProcessed: number;
  recordsMatched: number;
  totalTokens: number;
  promptTokens: number;
  completionTokens: number;
  inputTokens: number;
  outputTokens: number;
};

function toNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function extractUsage(candidate: unknown): UsageLike[] {
  const matches: UsageLike[] = [];

  function visit(value: unknown) {
    if (!value || typeof value !== "object") {
      return;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        visit(item);
      }
      return;
    }

    const record = value as Record<string, unknown>;
    const usage = record.usage;

    if (usage && typeof usage === "object" && !Array.isArray(usage)) {
      matches.push(usage as UsageLike);
    }

    for (const nested of Object.values(record)) {
      visit(nested);
    }
  }

  visit(candidate);
  return matches;
}

function parseJsonOrNdjson(raw: string): unknown[] {
  const trimmed = raw.trim();
  if (!trimmed) {
    return [];
  }

  try {
    return [JSON.parse(trimmed)];
  } catch {
    const lines = trimmed
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    const parsed: unknown[] = [];
    for (const line of lines) {
      try {
        parsed.push(JSON.parse(line));
      } catch {
        // Ignore non-JSON lines so mixed logs can still be processed.
      }
    }
    return parsed;
  }
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function main() {
  const files = process.argv.slice(2);

  if (files.length === 0) {
    console.error("Usage: npm run usage:sum -- <file1.json> [file2.ndjson ...]");
    process.exit(1);
  }

  const totals: Totals = {
    filesProcessed: 0,
    recordsMatched: 0,
    totalTokens: 0,
    promptTokens: 0,
    completionTokens: 0,
    inputTokens: 0,
    outputTokens: 0,
  };

  for (const file of files) {
    const absolutePath = resolve(file);
    const raw = readFileSync(absolutePath, "utf8");
    const documents = parseJsonOrNdjson(raw);
    const usages = documents.flatMap(extractUsage);

    totals.filesProcessed += 1;
    totals.recordsMatched += usages.length;

    for (const usage of usages) {
      const promptTokens = toNumber(usage.prompt_tokens);
      const completionTokens = toNumber(usage.completion_tokens);
      const inputTokens = toNumber(usage.input_tokens);
      const outputTokens = toNumber(usage.output_tokens);
      const totalTokens =
        toNumber(usage.total_tokens) ||
        promptTokens + completionTokens ||
        inputTokens + outputTokens;

      totals.promptTokens += promptTokens;
      totals.completionTokens += completionTokens;
      totals.inputTokens += inputTokens;
      totals.outputTokens += outputTokens;
      totals.totalTokens += totalTokens;
    }
  }

  console.log(`Files processed: ${totals.filesProcessed}`);
  console.log(`Usage records found: ${totals.recordsMatched}`);
  console.log(`Total tokens: ${formatNumber(totals.totalTokens)}`);
  console.log(`Prompt tokens: ${formatNumber(totals.promptTokens)}`);
  console.log(`Completion tokens: ${formatNumber(totals.completionTokens)}`);
  console.log(`Input tokens: ${formatNumber(totals.inputTokens)}`);
  console.log(`Output tokens: ${formatNumber(totals.outputTokens)}`);
}

main();
