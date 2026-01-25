import clsx from "clsx";
import hljs from "highlight.js";
import { useLayoutEffect, useRef } from "react";
import { escapeHtml } from "./helpers";
import type { CodeSnippetProps } from "./types";

const getCodeSnippet = ({ src, objectPosition }: CodeSnippetProps) => `<img
  src="${src}"
  style="object-fit: cover; object-position: ${objectPosition};"
/>`;

hljs.configure({ ignoreUnescapedHTML: true });

export function CodeSnippet({ src, objectPosition, className, ...rest }: CodeSnippetProps) {
  const ref = useRef<HTMLElement>(null);
  const escapedCodeSnippet = escapeHtml(getCodeSnippet({ src, objectPosition }));

  useLayoutEffect(() => {
    const codeElement = ref.current;
    if (codeElement == null) return;
    delete codeElement.dataset.highlighted;
    hljs.highlightElement(codeElement);
  });

  return (
    <pre className={clsx("language-html", className)} {...rest}>
      {/** biome-ignore lint/security/noDangerouslySetInnerHtml: Text is escaped and sanitized */}
      {<code ref={ref} dangerouslySetInnerHTML={{ __html: escapedCodeSnippet }} />}
    </pre>
  );
}
