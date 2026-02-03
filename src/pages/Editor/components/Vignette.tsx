import styled from "@emotion/styled";

const VignetteContent = styled.div`
  box-shadow: inset 0px 0px 1rem 1rem #f0f0f0;
  pointer-events: none;
`;

export function Vignette() {
  return <VignetteContent data-component="Vignette" />;
}
