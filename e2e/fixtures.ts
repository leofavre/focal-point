import { test as base } from "@playwright/test";
import { disableIndexedDBOnContext } from "./helpers";

const RTL_INIT_SCRIPT = () => {
  const setRTL = () => document.body?.setAttribute("dir", "rtl");
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setRTL);
  } else {
    setRTL();
  }
};

type IndexedDBFixtures = {
  /**
   * A page whose context has IndexedDB disabled (same as app "IndexedDB unavailable").
   * Use this fixture instead of `page` when the test should run with IndexedDB off.
   */
  pageWithoutIndexedDB: import("@playwright/test").Page;
};

type RTLFixtures = {
  /**
   * A page whose document body has dir="rtl" set on every load.
   * Use this fixture instead of `page` for RTL variants of tests (same steps as LTR, different fixture).
   */
  pageRTL: import("@playwright/test").Page;
};

export const test = base.extend<IndexedDBFixtures & RTLFixtures>({
  pageWithoutIndexedDB: async ({ browser, baseURL }, use) => {
    const context = await browser.newContext({
      baseURL: baseURL ?? "http://localhost:5173",
    });
    await disableIndexedDBOnContext(context);
    const page = await context.newPage();
    await use(page);
    await context.close();
  },

  pageRTL: async ({ browser, baseURL }, use) => {
    const context = await browser.newContext({
      baseURL: baseURL ?? "http://localhost:5173",
    });
    await context.addInitScript(RTL_INIT_SCRIPT);
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

export { expect } from "@playwright/test";
