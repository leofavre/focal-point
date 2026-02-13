import { expect, test } from "@playwright/test";
import {
  expectEditorWithControlsVisible,
  expectLandingVisible,
  SAMPLE_IMAGE_PATH,
} from "./helpers";

/**
 * E2E tests for bottom bar keyboard navigation.
 * Spec: e2e/specs/bottom-bar-keyboard.md
 *
 * When the bottom bar is visible (after uploading an image), Tab key must move
 * focus between the controls in visual order: Focal point → Overflow → Aspect
 * ratio slider → Code → Upload.
 */
test.describe("Bottom bar keyboard navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expectLandingVisible(page);
    const landing = page.locator('[data-component="Landing"]');
    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      landing.getByRole("button", { name: "Upload" }).click(),
    ]);
    await fileChooser.setFiles(SAMPLE_IMAGE_PATH);
    await expect(page).toHaveURL(/\/edit$/);
    await expectEditorWithControlsVisible(page);
  });

  test("bottom bar is visible when editor is shown", async ({ page }) => {
    const grid = page.locator("main[data-has-bottom-bar]");
    await expect(grid).toBeVisible();
    await expect(grid.locator('[data-component="FocalPointButton"]')).toBeVisible();
    await expect(grid.locator('[data-component="AspectRatioSlider"]')).toBeVisible();
    await expect(grid.getByRole("button", { name: "Upload" })).toBeVisible();
  });

  test("Tab moves focus through bottom bar controls in visual order", async ({ page }) => {
    const focalPoint = page.getByRole("button", { name: "Focal point" });
    const overflow = page.getByRole("button", { name: "Overflow" });
    const aspectRatioSlider = page.getByRole("slider");
    const code = page.getByRole("button", { name: "Code" });
    const upload = page.getByRole("button", { name: "Upload" });

    await focalPoint.focus();
    await expect(focalPoint).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(overflow).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(aspectRatioSlider).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(code).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(upload).toBeFocused();
  });

  test("Shift+Tab moves focus backward through bottom bar controls", async ({ page }) => {
    const focalPoint = page.getByRole("button", { name: "Focal point" });
    const overflow = page.getByRole("button", { name: "Overflow" });
    const aspectRatioSlider = page.getByRole("slider");
    const code = page.getByRole("button", { name: "Code" });
    const upload = page.getByRole("button", { name: "Upload" });

    await upload.focus();
    await expect(upload).toBeFocused();

    await page.keyboard.press("Shift+Tab");
    await expect(code).toBeFocused();

    await page.keyboard.press("Shift+Tab");
    await expect(aspectRatioSlider).toBeFocused();

    await page.keyboard.press("Shift+Tab");
    await expect(overflow).toBeFocused();

    await page.keyboard.press("Shift+Tab");
    await expect(focalPoint).toBeFocused();
  });
});
