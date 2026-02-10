import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test("shows project description and upload button when visiting /", async ({ page }) => {
    await page.goto("/");

    // Wait for landing: description section (stable selector; copy may change)
    const landing = page.locator('[data-component="Landing"]');
    await expect(landing.locator('[data-component="HowToUse"]')).toBeVisible();

    await expect(landing.getByRole("button", { name: "Upload" })).toBeVisible();
  });
});
