import styled from "@emotion/styled";

export const LandingWrapper = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto;
  padding: var(--base-line-2x);
  padding-right: var(--base-line);
  gap: var(--base-line-2x);
  box-sizing: border-box;

  [data-component="ImageUploaderButton"] {
    width: 18rem;
    grid-row: auto;
    grid-column: auto;
  }
`;
