import path from "node:path";
import { test, expect } from "@playwright/test";

const SAMPLE_IMAGE_PATH = path.join(process.cwd(), "e2e", "fixtures", "sample.png");

function expectEditorWithControlsVisible(page: import("@playwright/test").Page) {
  const focalPointEditor = page.locator('[data-component="FocalPointEditor"]');
  const aspectRatioSlider = page.locator('[data-component="AspectRatioSlider"]');
  const focalPointButton = page.locator('[data-component="FocalPointButton"]');
  const imageOverflowButton = page.locator('[data-component="ImageOverflowButton"]');
  const codeSnippetButton = page.locator('[data-component="CodeSnippetButton"]');
  const uploadButton = page.getByRole("button", { name: "Upload" });

  return Promise.all([
    expect(focalPointEditor).toBeVisible(),
    expect(aspectRatioSlider).toBeVisible(),
    expect(focalPointButton).toBeVisible(),
    expect(imageOverflowButton).toBeVisible(),
    expect(codeSnippetButton).toBeVisible(),
    expect(uploadButton).toBeVisible(),
  ]);
}

function disableIndexedDB(page: import("@playwright/test").Page) {
  return page.addInitScript(() => {
    try {
      Object.defineProperty(window, "indexedDB", {
        get: () => undefined,
        configurable: true,
        enumerable: true,
      });
    } catch {
      // ignore if not configurable
    }
  });
}

test.describe("Navigation and back button", () => {
  test("IndexedDB available: upload redirects to /edit, back returns to / with Landing visible", async ({
    page,
  }) => {
    await page.goto("/");

    const landing = page.locator('[data-component="Landing"]');
    await expect(landing).toBeVisible();
    await expect(landing.getByRole("button", { name: "Upload" })).toBeVisible();

    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      landing.getByRole("button", { name: "Upload" }).click(),
    ]);
    await fileChooser.setFiles(SAMPLE_IMAGE_PATH);

    await expect(page).toHaveURL(/\/edit$/);
    await expectEditorWithControlsVisible(page);

    await page.goBack();

    await expect(page).toHaveURL("/");
    const landingAfterBack = page.locator('[data-component="Landing"]');
    await expect(landingAfterBack).toBeVisible();
    await expect(landingAfterBack.getByRole("button", { name: "Upload" })).toBeVisible();
  });

  test("IndexedDB not available: upload stays on /, back leaves app", async ({
    page,
  }) => {
    await disableIndexedDB(page);
    await page.goto("about:blank");
    await page.goto("/");

    const landing = page.locator('[data-component="Landing"]');
    await expect(landing).toBeVisible();
    await expect(landing.getByRole("button", { name: "Upload" })).toBeVisible();

    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      landing.getByRole("button", { name: "Upload" }).click(),
    ]);
    await fileChooser.setFiles(SAMPLE_IMAGE_PATH);

    await expect(page).toHaveURL(/\/$/);
    await expectEditorWithControlsVisible(page);

    await page.goBack();

    await expect(page).toHaveURL("about:blank");
  });
});
