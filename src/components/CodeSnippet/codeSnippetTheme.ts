import type { PrismTheme } from "prism-react-renderer";

/**
 * Code snippet syntax theme using project CSS variables from main.css.
 * Inline styles accept var() and resolve at runtime, so colors stay in sync automatically.
 */
export const codeSnippetTheme: PrismTheme = {
  plain: {
    color: "var(--color-zero)",
    backgroundColor: "transparent",
  },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      style: {
        color: "var(--color-neutral)",
      },
    },
    {
      types: ["punctuation"],
      style: {
        color: "var(--color-neutral)",
      },
    },
    {
      types: ["tag"],
      style: {
        color: "var(--color-loud)",
      },
    },
    {
      types: ["attr-name"],
      style: {
        color: "var(--color-loud)",
      },
    },
    {
      types: ["string", "char", "attr-value", "inserted", "entity", "url"],
      style: {
        color: "var(--color-loud)",
      },
    },
    {
      types: ["keyword", "variable", "boolean", "operator", "number"],
      style: {
        color: "var(--color-loud)",
      },
    },
    {
      types: ["property", "function", "constant", "symbol"],
      style: {
        color: "var(--color-loud)",
      },
    },
    {
      types: ["deleted"],
      style: {
        color: "var(--color-neutral)",
      },
    },
  ],
};
