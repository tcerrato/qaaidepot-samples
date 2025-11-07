import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { createInterface } from "readline";
import { applyUpdates, clearPending, type PendingUpdate } from "../healing/healer.js";

const PENDING_PATH = join(process.cwd(), "healing", "pending-updates.json");

async function readPending(): Promise<PendingUpdate[]> {
  try {
    const content = await readFile(PENDING_PATH, "utf-8");
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function askQuestion(query: string): Promise<string> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  console.log("🔍 Reviewing pending selector updates...\n");

  const pending = await readPending();

  if (pending.length === 0) {
    console.log("✓ No pending updates to review.");
    return;
  }

  console.log(`Found ${pending.length} pending update(s):\n`);

  const approved: PendingUpdate[] = [];
  const rejected: PendingUpdate[] = [];

  for (const update of pending) {
    console.log(`Key: ${update.key}`);
    console.log(`New Selector: ${update.newSel}`);
    console.log(`Score: ${update.score}`);
    console.log(`Reason: ${update.reason}`);
    console.log(`Timestamp: ${update.ts}`);
    console.log("");

    const answer = await askQuestion("Approve this update? (y/n/a=all/q=quit): ");

    if (answer.toLowerCase() === "q") {
      console.log("\nReview cancelled.");
      return;
    }

    if (answer.toLowerCase() === "a") {
      // Approve all remaining
      approved.push(...pending.slice(pending.indexOf(update)));
      break;
    }

    if (answer.toLowerCase() === "y") {
      approved.push(update);
      console.log("✓ Approved\n");
    } else {
      rejected.push(update);
      console.log("✗ Rejected\n");
    }
  }

  if (approved.length > 0) {
    await applyUpdates(approved);
    console.log(`\n✓ Applied ${approved.length} update(s) to catalog.json`);
  }

  if (rejected.length > 0) {
    console.log(`\n✗ Rejected ${rejected.length} update(s)`);
  }

  // Clear pending after review
  await clearPending();
  console.log("\n✓ Cleared pending updates");
}

main().catch((error) => {
  console.error("Error during review:", error);
  process.exit(1);
});
