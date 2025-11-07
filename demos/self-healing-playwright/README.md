# Self-Healing Playwright Demo

A demonstration of Tier 1 self-healing test automation using selector catalogs, heuristic fallbacks, and human-approved updates.

## Overview

This demo shows how to implement self-healing tests that:
1. Use a catalog of primary selectors with fallbacks
2. Automatically try fallback selectors when primary fails
3. Queue successful fallbacks for human review
4. Update the catalog only after approval

## Quick Start

### Prerequisites

This demo tests against the `test-app` in this monorepo. Make sure it's running:

```bash
# From the root directory
cd ../test-app
pnpm dev
# This starts the app on http://localhost:3002
```

### 1. Install Dependencies

```bash
# From self-healing-playwright directory
pnpm install
```

### 2. Run Tests (Initial Pass)

```bash
pnpm test
```

Tests should pass using the primary selectors from `healing/catalog.json`. The test will:
- Navigate to the test-app login page
- Fill in username and password using healing locators
- Click the submit button
- Verify successful login and redirect to products page

### 3. Simulate a Selector Failure (See Self-Healing in Action)

To see the self-healing mechanism work, you need to break a selector. Here are several ways:

#### Option A: Break the Primary Selector in Catalog (Easiest)

Edit `healing/catalog.json` and change a primary selector to something that doesn't exist:

```json
{
  "login.submitBtn": {
    "primary": "[data-testid='login-submit-BROKEN']",  // ← Changed to non-existent
    "fallbacks": [
      "button[type='submit']",  // ← This will work as fallback
      "button:has-text('Login')",
      ...
    ]
  }
}
```

#### Option B: Change the Test-App (Most Realistic)

Edit `../test-app/src/pages/Login.tsx` and change the `data-testid`:

```tsx
// Change from:
<button data-testid="login-submit" ...>

// To:
<button data-testid="login-continue" ...>  // ← Different ID
```

The catalog still expects `login-submit`, so the primary will fail and fallbacks will be tried.

#### Option C: Remove data-testid from Test-App

Edit `../test-app/src/pages/Login.tsx` and remove the `data-testid` attribute:

```tsx
// Remove data-testid:
<button type="submit" ...>  // ← No data-testid
```

The primary selector `[data-testid='login-submit']` will fail, but `button[type='submit']` in fallbacks will work.

### 4. Run Tests Again (Healing Kicks In)

```bash
pnpm test
```

The test will:
1. Try the primary selector → **FAILS**
2. Automatically try fallback selectors from the catalog
3. Find a working fallback (e.g., `button[type='submit']`)
4. Queue the update in `healing/pending-updates.json`
5. Continue the test successfully

Check `healing/pending-updates.json` to see the queued update.

### 5. Review and Approve Updates

```bash
pnpm review
```

This interactive CLI will:
- Show all pending updates with details (key, new selector, score, reason)
- Ask you to approve (y), reject (n), approve all (a), or quit (q)
- Update `healing/catalog.json` with approved changes
- Clear the pending updates file

### 6. Run Tests Again (Should Pass)

```bash
pnpm test
```

Tests should now pass with the updated catalog. The previously working fallback is now the primary selector.

### 7. Restore Test-App (Optional)

If you modified the test-app for demo purposes, restore it:

```bash
# In test-app/src/pages/Login.tsx, restore:
<button data-testid="login-submit" type="submit" ...>
```

## Using with Other Applications

To use this self-healing system with a different application:

1. **Update `playwright.config.ts`**:
   ```typescript
   use: {
     baseURL: "http://your-app-url:port",
   }
   ```

2. **Update `healing/catalog.json`**:
   - Add catalog entries for your app's selectors
   - Define primary selectors (prefer `data-testid` if available)
   - Add fallback selectors (ID, class, type, text, etc.)

3. **Update tests**:
   - Use `healingLocator(page, "your.key")` instead of `page.locator(...)`
   - Use `clickWithHealing(page, "your.key")` instead of `page.click(...)`

4. **Add data-testid attributes** (recommended):
   - Add `data-testid` attributes to your app's elements
   - This provides the most stable selectors for the catalog

Example catalog entry for a different app:

```json
{
  "checkout.submitOrder": {
    "primary": "[data-testid='checkout-submit']",
    "fallbacks": [
      "button[type='submit']",
      "button:has-text('Place Order')",
      "#checkout-submit-btn"
    ]
  }
}
```

## Project Structure

```
self-healing-playwright/
├── healing/
│   ├── catalog.json          # Selector catalog (primary + fallbacks)
│   ├── pending-updates.json  # Queue of updates awaiting review
│   ├── healer.ts            # Catalog loading and update management
│   ├── locator.ts           # Healing locator wrappers
│   ├── rules.ts             # Selector scoring rules
│   └── telemetry.ts         # Optional failure snapshots
├── scripts/
│   └── heal-review.ts       # CLI for reviewing pending updates
├── tests/
│   └── login.spec.ts        # Example test using healing locators
├── playwright.config.ts
└── package.json
```

## How It Works

### Selector Catalog

The `healing/catalog.json` file stores selectors by key:

```json
{
  "login.submitBtn": {
    "primary": "[data-testid='login-submit']",
    "fallbacks": [
      "button[type='submit']",
      "button:has-text('Login')",
      "//button[contains(text(), 'Login')]"
    ]
  }
}
```

### Healing Flow

1. **Primary Selector Fails**: Test tries the primary selector from catalog
2. **Fallback Attempts**: System tries each fallback in order
3. **Success**: If a fallback works, it's queued for review
4. **Review**: Human reviews and approves/rejects updates
5. **Catalog Update**: Approved updates become the new primary

### Selector Scoring

The `healing/rules.ts` module scores selectors:
- **+50**: `data-testid` attributes (most stable)
- **+30**: `name` attributes
- **+20**: ID selectors
- **-30**: XPath selectors (less stable)
- **-20**: Very long selectors (>100 chars)

Higher scores are preferred when multiple fallbacks work.

## Scripts

- `pnpm test` - Run Playwright tests
- `pnpm review` - Review and approve pending selector updates
- `pnpm dev` - Run tests in UI mode
- `pnpm typecheck` - Type check without emitting files
- `pnpm lint` - Lint placeholder

## Best Practices

1. **Always Review Updates**: Never auto-apply selector changes
2. **Prefer Stable Selectors**: Use `data-testid` when possible
3. **Keep Fallbacks Simple**: Fewer, better fallbacks > many fragile ones
4. **Monitor Pending Updates**: Review regularly to keep catalog current
5. **Use Telemetry**: Enable DOM snapshots for debugging failures

## Limitations

- No external database (uses JSON files)
- Simple heuristic scoring (not ML-based)
- Requires manual review (no auto-approval)
- Best for deterministic selector changes

## Extending

To add more healing capabilities:

1. **Add More Rules**: Extend `healing/rules.ts` with domain-specific scoring
2. **Enhanced Telemetry**: Add screenshots, network logs, etc. in `telemetry.ts`
3. **ML Integration**: Replace heuristic scoring with ML models
4. **Auto-Healing**: Add confidence thresholds for auto-approval

## CI/CD Integration

See `.github/workflows/self-healing-demo.yml` for GitHub Actions integration that:
- Runs tests on every push
- Prints pending updates if present
- Fails if pending updates exist (optional)
