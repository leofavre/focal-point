import type { Ref } from "react";
import type { CodeSnippetLanguage, ObjectPositionString } from "../../types";

export type CodeSnippetProps = {
  ref?: Ref<HTMLPreElement>;
  src: string;
  objectPosition: ObjectPositionString;
  language?: CodeSnippetLanguage;
  codeSnippetCopied: boolean;
  setCodeSnippetCopied: (copied: boolean) => void;
};
