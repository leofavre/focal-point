import styled from "@emotion/styled";

/**
 * Full-screen drop zone using the native Popover API (top layer).
 * Backdrop styled to match Dialog component.
 */
export const Overlay = styled.div`
  &[popover] {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    border: none;
    background: transparent;
    overflow: hidden;
    display: flex;
    box-shadow: none;
  }

  &[popover]::backdrop {
    background-color: rgba(0, 0, 0, 0);
  }

  &:popover-open::backdrop {
    background-color: var(--color-backdrop);
    transition:
      background-color 132ms ease-in-out,
      display 132ms ease-in-out allow-discrete,
      overlay 132ms ease-in-out allow-discrete;
  }

  @starting-style {
    &:popover-open::backdrop {
      background-color: rgba(0, 0, 0, 0);
    }
  }

  p {
    font-size: clamp(1.25rem, 4dvw, 2rem);
    color: var(--color-zero);
    margin: auto;
    padding: var(--base-line-2x);
    border: 2px dashed var(--color-zero);
  }
`;
