import { CodeBlock } from "react-code-block";
import type { CodeSnippetProps } from "./types";

const getCodeSnippet = ({ src, objectPosition }: CodeSnippetProps) => `<img
  src="${src}"
  style="object-fit: cover; object-position: ${objectPosition};"
/>`;

export function CodeSnippet({ ref, src, objectPosition }: CodeSnippetProps) {
  const codeSnippet = getCodeSnippet({ src, objectPosition });

  return (
    <CodeBlock code={codeSnippet} language="html">
      <CodeBlock.Code ref={ref} className="code-snippet">
        <div className="line">
          <CodeBlock.LineNumber className="line-number" />
          <CodeBlock.LineContent className="line-content">
            <CodeBlock.Token />
          </CodeBlock.LineContent>
        </div>
      </CodeBlock.Code>
    </CodeBlock>
  );
}
