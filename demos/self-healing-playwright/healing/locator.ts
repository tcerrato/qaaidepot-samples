import { Locator, Page } from "@playwright/test";
import { loadCatalog, queueUpdate } from "./healer.js";
import { scoreSelector } from "./rules.js";
import { captureFailureSnapshot } from "./telemetry.js";

/**
 * Get a locator with healing fallbacks
 */
export async function healingLocator(
  page: Page,
  key: string
): Promise<Locator | null> {
  const catalog = await loadCatalog();
  const entry = catalog[key];

  if (!entry) {
    console.warn(`No catalog entry for key: ${key}`);
    return null;
  }

  // Try primary selector first
  const primary = page.locator(entry.primary);
  const primaryCount = await primary.count();

  if (primaryCount > 0) {
    return primary.first();
  }

  // Primary failed, try fallbacks
  console.log(`Primary selector failed for ${key}, trying fallbacks...`);

  for (const fallback of entry.fallbacks) {
    try {
      const locator = page.locator(fallback);
      const count = await locator.count();

      if (count > 0) {
        const score = scoreSelector(fallback);
        const reason = `Primary selector failed, fallback succeeded: ${fallback}`;

        // Queue update for review
        await queueUpdate({
          key,
          newSel: fallback,
          score,
          reason,
          ts: new Date().toISOString(),
        });

        console.log(`✓ Fallback succeeded for ${key}: ${fallback}`);
        return locator.first();
      }
    } catch (error) {
      // Continue to next fallback
      continue;
    }
  }

  // All selectors failed
  console.error(`All selectors failed for ${key}`);
  await captureFailureSnapshot(page, key, entry.primary);
  return null;
}

/**
 * Click with healing fallbacks
 */
export async function clickWithHealing(
  page: Page,
  key: string,
  options?: { timeout?: number }
): Promise<void> {
  const locator = await healingLocator(page, key);

  if (!locator) {
    throw new Error(`Could not find element for key: ${key}`);
  }

  await locator.click(options);
}
