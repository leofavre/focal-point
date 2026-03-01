import { expect, test } from "@playwright/test";
import {
  changeAspectRatioSliderSteps,
  closeCodeSnippetDialog,
  dragFocalPointInEditor,
  dragImageInFocalPointEditor,
  getCodeSnippetObjectPosition,
  seedEditorWithImage,
  waitForEditorReady,
} from "./helpers";

/**
 * Editor draggables and generated code.
 * Plan: e2e/editor-draggables-and-code.plan.md
 */
test.describe("Editor draggables and code", () => {
  test.use({ permissions: ["clipboard-read", "clipboard-write"] });
  test("after image upload, change aspect ratio then image is draggable", async ({ page }) => {
    await seedEditorWithImage(page);
    await waitForEditorReady(page);
    await changeAspectRatioSliderSteps(page, 3);

    await dragImageInFocalPointEditor(page, { from: { x: 0.5, y: 0.5 }, to: { x: 0.25, y: 0.25 } });
  });

  test("generated code changes when image is dragged", async ({ page }) => {
    await seedEditorWithImage(page);
    await waitForEditorReady(page);
    await changeAspectRatioSliderSteps(page, 3);

    await page.getByRole("button", { name: "Code" }).click();
    const codeBefore = await getCodeSnippetObjectPosition(page);
    expect(codeBefore).toBeTruthy();
    await closeCodeSnippetDialog(page);

    await dragImageInFocalPointEditor(page, { from: { x: 0.5, y: 0.5 }, to: { x: 0.2, y: 0.8 } });

    await page.getByRole("button", { name: "Code" }).click();
    await page.getByRole("button", { name: "Copy" }).click();
    await expect(page.getByText("Code copied to clipboard")).toBeVisible();
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toBeTruthy();
    const objectPositionMatch = clipboardText.match(/object-position:\s*([^;]+)/);
    expect(objectPositionMatch).toBeTruthy();
    const codeAfter = objectPositionMatch?.[1]?.trim() ?? "";
    expect(codeAfter).not.toBe(codeBefore);
  });

  test("when Overflow is on, overlay image is draggable", async ({ page }) => {
    await seedEditorWithImage(page);
    await waitForEditorReady(page);
    await changeAspectRatioSliderSteps(page, 3);
    await page.getByRole("button", { name: "Overflow" }).click();
    await expect(page.getByRole("button", { name: "Overflow" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await dragImageInFocalPointEditor(page, { from: { x: 0.5, y: 0.5 }, to: { x: 0.3, y: 0.3 } });
  });

  test("generated code changes when overlay image is dragged", async ({ page }) => {
    await seedEditorWithImage(page);
    await waitForEditorReady(page);
    await changeAspectRatioSliderSteps(page, 3);
    await page.getByRole("button", { name: "Overflow" }).click();

    await page.getByRole("button", { name: "Code" }).click();
    const codeBefore = await getCodeSnippetObjectPosition(page);
    expect(codeBefore).toBeTruthy();
    await closeCodeSnippetDialog(page);

    await dragImageInFocalPointEditor(page, { from: { x: 0.6, y: 0.6 }, to: { x: 0.2, y: 0.2 } });

    await page.getByRole("button", { name: "Code" }).click();
    await page.getByRole("button", { name: "Copy" }).click();
    await expect(page.getByText("Code copied to clipboard")).toBeVisible();
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    const objectPositionMatch = clipboardText.match(/object-position:\s*([^;]+)/);
    expect(objectPositionMatch).toBeTruthy();
    const codeAfter = objectPositionMatch?.[1]?.trim() ?? "";
    expect(codeAfter).not.toBe(codeBefore);
  });

  test("when Focal point is on, focal point can be dragged", async ({ page }) => {
    await seedEditorWithImage(page);

    await page.getByRole("button", { name: "Focal point" }).click();
    await expect(page.locator('[data-component="FocalPoint"]')).toBeVisible();

    await dragFocalPointInEditor(page, { to: { x: 0.25, y: 0.25 } });
  });

  test("generated code changes when focal point is dragged", async ({ page }) => {
    await seedEditorWithImage(page);
    await page.getByRole("button", { name: "Focal point" }).click();

    await page.getByRole("button", { name: "Code" }).click();
    const codeBefore = await getCodeSnippetObjectPosition(page);
    expect(codeBefore).toBeTruthy();
    await closeCodeSnippetDialog(page);

    await dragFocalPointInEditor(page, { to: { x: 0.75, y: 0.25 } });

    await page.getByRole("button", { name: "Code" }).click();
    await page.getByRole("button", { name: "Copy" }).click();
    await expect(page.getByText("Code copied to clipboard")).toBeVisible();
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    const objectPositionMatch = clipboardText.match(/object-position:\s*([^;]+)/);
    expect(objectPositionMatch).toBeTruthy();
    const codeAfter = objectPositionMatch?.[1]?.trim() ?? "";
    expect(codeAfter).not.toBe(codeBefore);
  });

  test("badge or code changes when focal point is dragged", async ({ page }) => {
    await seedEditorWithImage(page);
    await page.getByRole("button", { name: "Focal point" }).click();

    const badge = page.locator('[data-component="FocalPointBadge"]');
    const badgeVisible = await badge.isVisible();
    let positionBefore: string;
    if (badgeVisible) {
      positionBefore = (await badge.textContent()) ?? "";
      expect(positionBefore).toBeTruthy();
    } else {
      await page.getByRole("button", { name: "Code" }).click();
      positionBefore = (await getCodeSnippetObjectPosition(page)) ?? "";
      await closeCodeSnippetDialog(page);
    }

    await dragFocalPointInEditor(page, { to: { x: 0.8, y: 0.2 } });

    if (badgeVisible) {
      const positionAfter = (await badge.textContent()) ?? "";
      expect(positionAfter).not.toBe(positionBefore);
    } else {
      await page.getByRole("button", { name: "Code" }).click();
      await page.getByRole("button", { name: "Copy" }).click();
      await expect(page.getByText("Code copied to clipboard")).toBeVisible();
      const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
      const objectPositionMatch = clipboardText.match(/object-position:\s*([^;]+)/);
      const positionAfter = objectPositionMatch?.[1]?.trim() ?? "";
      expect(positionAfter).not.toBe(positionBefore);
    }
  });

  test("focal point changes when image is dragged", async ({ page }) => {
    await seedEditorWithImage(page);
    await waitForEditorReady(page);
    await changeAspectRatioSliderSteps(page, 3);
    await page.getByRole("button", { name: "Focal point" }).click();

    await page.getByRole("button", { name: "Code" }).click();
    const codeBefore = await getCodeSnippetObjectPosition(page);
    expect(codeBefore).toBeTruthy();
    await closeCodeSnippetDialog(page);

    await page.getByRole("button", { name: "Focal point" }).click();
    await dragImageInFocalPointEditor(page, { from: { x: 0.5, y: 0.5 }, to: { x: 0.25, y: 0.25 } });
    await page.getByRole("button", { name: "Focal point" }).click();

    await page.getByRole("button", { name: "Code" }).click();
    await page.getByRole("button", { name: "Copy" }).click();
    await expect(page.getByText("Code copied to clipboard")).toBeVisible();
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    const objectPositionMatch = clipboardText.match(/object-position:\s*([^;]+)/);
    expect(objectPositionMatch).toBeTruthy();
    const codeAfter = objectPositionMatch?.[1]?.trim() ?? "";
    expect(codeAfter).not.toBe(codeBefore);
  });

  test("focal point changes when overlay image is dragged", async ({ page }) => {
    await seedEditorWithImage(page);
    await waitForEditorReady(page);
    await changeAspectRatioSliderSteps(page, 3);
    await page.getByRole("button", { name: "Focal point" }).click();
    await page.getByRole("button", { name: "Overflow" }).click();

    await page.getByRole("button", { name: "Code" }).click();
    const codeBefore = await getCodeSnippetObjectPosition(page);
    expect(codeBefore).toBeTruthy();
    await closeCodeSnippetDialog(page);

    await page.getByRole("button", { name: "Focal point" }).click();
    await dragImageInFocalPointEditor(page, { from: { x: 0.5, y: 0.5 }, to: { x: 0.25, y: 0.25 } });
    await page.getByRole("button", { name: "Focal point" }).click();

    await page.getByRole("button", { name: "Code" }).click();
    await page.getByRole("button", { name: "Copy" }).click();
    await expect(page.getByText("Code copied to clipboard")).toBeVisible();
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    const objectPositionMatch = clipboardText.match(/object-position:\s*([^;]+)/);
    expect(objectPositionMatch).toBeTruthy();
    const codeAfter = objectPositionMatch?.[1]?.trim() ?? "";
    expect(codeAfter).not.toBe(codeBefore);
  });
});
