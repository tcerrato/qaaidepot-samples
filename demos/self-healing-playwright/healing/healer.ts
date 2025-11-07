import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { z } from "zod";
import { scoreSelector } from "./rules.js";

const PendingUpdateSchema = z.object({
  key: z.string(),
  newSel: z.string(),
  score: z.number(),
  reason: z.string(),
  ts: z.string(),
});

export type PendingUpdate = z.infer<typeof PendingUpdateSchema>;

const CatalogSchema = z.record(
  z.object({
    primary: z.string(),
    fallbacks: z.array(z.string()),
  })
);

type Catalog = z.infer<typeof CatalogSchema>;

const CATALOG_PATH = join(process.cwd(), "healing", "catalog.json");
const PENDING_PATH = join(process.cwd(), "healing", "pending-updates.json");

/**
 * Load the selector catalog
 */
export async function loadCatalog(): Promise<Catalog> {
  try {
    const content = await readFile(CATALOG_PATH, "utf-8");
    const parsed = JSON.parse(content);
    return CatalogSchema.parse(parsed);
  } catch (error) {
    console.warn("Failed to load catalog, using empty catalog:", error);
    return {};
  }
}

/**
 * Write a pending update to the queue
 */
export async function queueUpdate(update: PendingUpdate): Promise<void> {
  let pending: PendingUpdate[] = [];

  try {
    const content = await readFile(PENDING_PATH, "utf-8");
    pending = JSON.parse(content);
    if (!Array.isArray(pending)) {
      pending = [];
    }
  } catch {
    // File doesn't exist or is invalid, start fresh
    pending = [];
  }

  // Check if update for this key already exists
  const existingIndex = pending.findIndex((u) => u.key === update.key);
  if (existingIndex >= 0) {
    // Replace if new score is better
    if (update.score > pending[existingIndex].score) {
      pending[existingIndex] = update;
    } else {
      return; // Keep existing better update
    }
  } else {
    pending.push(update);
  }

  await writeFile(PENDING_PATH, JSON.stringify(pending, null, 2), "utf-8");
}

/**
 * Apply approved updates to catalog
 */
export async function applyUpdates(updates: PendingUpdate[]): Promise<void> {
  const catalog = await loadCatalog();

  for (const update of updates) {
    const [namespace, key] = update.key.split(".");
    if (!catalog[update.key]) {
      catalog[update.key] = { primary: update.newSel, fallbacks: [] };
    } else {
      // Move old primary to fallbacks, set new primary
      const oldPrimary = catalog[update.key].primary;
      if (!catalog[update.key].fallbacks.includes(oldPrimary)) {
        catalog[update.key].fallbacks.unshift(oldPrimary);
      }
      catalog[update.key].primary = update.newSel;
    }
  }

  await writeFile(CATALOG_PATH, JSON.stringify(catalog, null, 2), "utf-8");
}

/**
 * Clear pending updates after approval
 */
export async function clearPending(): Promise<void> {
  await writeFile(PENDING_PATH, JSON.stringify([], null, 2), "utf-8");
}
