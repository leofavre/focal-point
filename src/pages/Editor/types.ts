import type { CodeSnippetLanguage } from "../../types";

export type EditorCodeSnippetHeaderProps = {
  codeSnippetLanguage: CodeSnippetLanguage;
  setCodeSnippetLanguage: (language: CodeSnippetLanguage) => void;
};
