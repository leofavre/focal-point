import type { PropsWithChildren } from "react";
import { Content } from "./HowToUse.styled";

export const HowToUse = ({ children, ...rest }: PropsWithChildren) => {
  return (
    <Content data-component="HowToUse" {...rest}>
      {children}
    </Content>
  );
};
