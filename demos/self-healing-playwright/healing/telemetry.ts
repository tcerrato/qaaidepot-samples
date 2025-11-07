import { Page } from "@playwright/test";
import { writeFile } from "fs/promises";
import { join } from "path";

/**
 * Optional: Capture DOM snapshot on failure for debugging
 */
export async function captureFailureSnapshot(
  page: Page,
  key: string,
  selector: string
): Promise<void> {
  try {
    const html = await page.content();
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `failure-${key}-${timestamp}.html`;
    const filepath = join(process.cwd(), "healing", filename);

    await writeFile(
      filepath,
      `<!-- Failed selector: ${selector} -->\n${html}`,
      "utf-8"
    );
  } catch (error) {
    // Silently fail - telemetry is optional
    console.warn("Failed to capture snapshot:", error);
  }
}
