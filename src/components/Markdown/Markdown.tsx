import { Wrapper } from "./Markdown.styled";
import type { MarkdownProps } from "./types";

export const Markdown = ({ children, ...rest }: MarkdownProps) => {
  return (
    <Wrapper data-component="Markdown" {...rest}>
      {children}
    </Wrapper>
  );
};
