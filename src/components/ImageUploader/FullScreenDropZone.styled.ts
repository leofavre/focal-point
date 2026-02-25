import styled from "@emotion/styled";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  background-color: var(--color-backdrop);
  transition: opacity 360ms ease-in-out;
  display: flex;

  p {
    font-size: clamp(1.25rem, 4dvw, 2rem);
    color: var(--color-zero);
    margin: auto;
    padding: var(--base-line-2x);
    border: 2px dashed var(--color-zero);
  }
`;
