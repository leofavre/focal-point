import type { ClipboardEvent } from "react";
import { useCallback } from "react";
import { CodeBlock } from "react-code-block";
import { Code, Line, LineContent, LineNumber, Wrapper } from "./CodeSnippet.styled";
import { codeSnippetTheme } from "./codeSnippetTheme";
import { getCodeBlockLanguage, getCodeSnippet } from "./helpers/getCodeSnippet";
import { normalizeWhitespaceInQuotes } from "./helpers/normalizeWhitespaceInQuotes";
import type { CodeSnippetProps } from "./types";

export function CodeSnippet({
  ref,
  src,
  objectPosition,
  language = "html",
  ...rest
}: CodeSnippetProps) {
  const codeSnippet = getCodeSnippet({ language, src, objectPosition });
  const codeBlockLanguage = getCodeBlockLanguage(language);

  const handleCopyCapture = useCallback((event: ClipboardEvent) => {
    const { clipboardData } = event;
    if (clipboardData == null) return;

    const selection = window.getSelection();
    const selectedText = selection?.toString() ?? "";
    if (selectedText.length === 0) return;

    event.preventDefault();
    clipboardData.clearData();
    clipboardData.setData("text/plain", normalizeWhitespaceInQuotes(selectedText));
  }, []);

  return (
    <Wrapper data-component="CodeSnippet" onCopy={handleCopyCapture} {...rest}>
      <CodeBlock code={codeSnippet} language={codeBlockLanguage} theme={codeSnippetTheme}>
        <Code ref={ref} className="notranslate">
          <Line>
            <LineNumber />
            <LineContent>
              <CodeBlock.Token />
            </LineContent>
          </Line>
        </Code>
      </CodeBlock>
    </Wrapper>
  );
}
