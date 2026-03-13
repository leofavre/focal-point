import { StyledTitle } from "./SiteTitle.styled";
import type { SiteTitleProps } from "./types";

export function SiteTitle({ ref, children = "Focal Point Editor", ...rest }: SiteTitleProps) {
  return (
    <StyledTitle ref={ref} data-component="SiteTitle" {...rest}>
      {children}
    </StyledTitle>
  );
}
