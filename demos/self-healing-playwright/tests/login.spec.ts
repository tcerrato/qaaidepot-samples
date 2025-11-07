import { test, expect } from "@playwright/test";
import { clickWithHealing, healingLocator } from "../healing/locator.js";

test.describe("Login Flow", () => {
  test("should login with username, password and submit button", async ({ page }) => {
    // Navigate to the test-app login page
    // Make sure test-app is running: cd ../test-app && pnpm dev
    await page.goto("/login");

    // Wait for page to load
    await expect(page.locator("h1:has-text('Login')")).toBeVisible();

    // Use healing locator for username input
    const usernameInput = await healingLocator(page, "login.usernameInput");
    expect(usernameInput).not.toBeNull();
    await usernameInput!.fill("admin");

    // Use healing locator for password input
    const passwordInput = await healingLocator(page, "login.passwordInput");
    expect(passwordInput).not.toBeNull();
    await passwordInput!.fill("password123");

    // Use healing click for submit button
    await clickWithHealing(page, "login.submitBtn");

    // Verify successful login - should redirect to products page
    await expect(page).toHaveURL(/\/products/);
    await expect(page.locator("h1:has-text('Products')")).toBeVisible();
  });
});
