/**
 * Scoring rules for selector evaluation
 * Higher score = better selector
 */

export function scoreSelector(selector: string): number {
  let score = 100;

  // Prefer data-testid (most stable)
  if (selector.includes("[data-testid")) {
    score += 50;
  }

  // Prefer name attributes
  if (selector.includes("[name=")) {
    score += 30;
  }

  // Prefer ID selectors
  if (selector.startsWith("#")) {
    score += 20;
  }

  // Prefer class selectors over tag selectors
  if (selector.startsWith(".")) {
    score += 10;
  }

  // Penalize XPath (less stable, harder to maintain)
  if (selector.startsWith("//") || selector.startsWith("(//")) {
    score -= 30;
  }

  // Penalize very long selectors (fragile)
  if (selector.length > 100) {
    score -= 20;
  }

  // Penalize complex CSS selectors with many combinators
  const combinatorCount = (selector.match(/[>+~]/g) || []).length;
  if (combinatorCount > 3) {
    score -= 15;
  }

  // Prefer text-based selectors for buttons/links
  if (selector.includes(":has-text(") || selector.includes("text=")) {
    score += 15;
  }

  return Math.max(0, score);
}
