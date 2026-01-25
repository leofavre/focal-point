import clsx from "clsx";
import hljs from "highlight.js";
import { useLayoutEffect, useRef } from "react";
import { escapeHtml } from "./helpers";
import type { CodeSnippetProps } from "./types";

const getCodeSnippet = ({ src, objectPosition }: CodeSnippetProps) => `<img
  src="${src}"
  style="object-fit: cover; object-position: ${objectPosition};"
/>`;

export function CodeSnippet({ src, objectPosition, className, ...rest }: CodeSnippetProps) {
  const ref = useRef<HTMLElement>(null);
  const escapedCodeSnippet = escapeHtml(getCodeSnippet({ src, objectPosition }));

  useLayoutEffect(() => {
    if (ref.current == null) return;
    delete ref.current.dataset.highlighted;
    hljs.highlightElement(ref.current);
  });

  return (
    <pre className={clsx("language-html", className)} {...rest}>
      {/** biome-ignore lint/security/noDangerouslySetInnerHtml: Text is escaped */}
      {<code ref={ref} dangerouslySetInnerHTML={{ __html: escapedCodeSnippet }} />}
    </pre>
  );
}
