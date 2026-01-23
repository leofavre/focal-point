import type { CodeSnippetProps } from "./types";

export function CodeSnippet({ src, objectPosition, ...rest }: CodeSnippetProps) {
  return (
    <pre {...rest}>
      <code>
        {`<img
  src="${src}"
  style="object-position: ${objectPosition}; object-fit: cover;"
/>`}
      </code>
    </pre>
  );
}
