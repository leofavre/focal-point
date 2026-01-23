import type { CodeSnippetProps } from "./types";

const getCodeSnippet = ({ src, objectPosition }: CodeSnippetProps) => `<img
  src="${src}"
  style="object-fit: cover; object-position: ${objectPosition};"
/>`;

export function CodeSnippet({ src, objectPosition, ...rest }: CodeSnippetProps) {
  return (
    <pre {...rest}>
      <code>{getCodeSnippet({ src, objectPosition })}</code>
    </pre>
  );
}
