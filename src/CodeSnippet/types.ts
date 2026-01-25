import type { ObjectPositionString, StyleProps } from "../types";

export type CodeSnippetProps = StyleProps & {
  src: string;
  objectPosition: ObjectPositionString;
};
