import styled from "@emotion/styled";

export const AspectRatioSliderWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;

  [data-component="AspectRatioControl"] {
    position: relative;
    z-index: 1;
  }

  [data-component="AspectRatioRuler"] {
    position: relative;
    margin-left: 0.46875rem;
    margin-right: 0.53125rem;
    margin-top: -0.75rem;
    z-index: 0;
  }
`;
