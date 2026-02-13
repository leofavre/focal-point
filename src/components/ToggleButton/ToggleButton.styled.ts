import styled from "@emotion/styled";

export const Button = styled.button`
  --scale: 1;

  &[data-scale=2] {
    --scale: 2;
  }

  --shadow-offset: calc(0.25rem * var(--scale));

  container-type: inline-size;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: calc(var(--base-line-025x) * var(--scale));
  min-width: calc((var(--base-line) + var(--base-line-05x)) * var(--scale));
  height: calc(2rem * var(--scale));
  padding: 0 calc(var(--base-line-025x) * var(--scale));
  border: calc(1px * var(--scale)) solid rgb(from var(--color-neutral) r g b);
  background-color: white;
  box-sizing: border-box;
  color: rgb(from var(--color-neutral) r g b);
  cursor: pointer;
  font: inherit;
  font-size: calc(14 / 16 * 1rem * var(--scale));
  white-space: nowrap;

  transition:
    background-color 100ms ease-in-out,
    border-color 100ms ease-in-out,
    color 100ms ease-in-out,
    box-shadow 100ms ease-in-out,
    transform 100ms ease-in-out;

  &:hover {
    background-color: rgb(from var(--color-neutral) r g b / 10%);
    border-color: rgb(from var(--color-neutral) r g b);
    color: rgb(from var(--color-neutral) r g b);
  }

  &:focus-visible {
    outline: calc(0.25rem * var(--scale)) solid var(--color-glow);
    border-radius: 0rem;
    outline-offset: 0;
  }

  &[aria-pressed="true"] {
    background-color: rgb(from var(--color-loud) r g b / 10%);
    border-color: rgb(from var(--color-loud) r g b);
    color: rgb(from var(--color-loud) r g b);
    transform: translate(var(--shadow-offset), var(--shadow-offset));

    &:hover {
      background-color: rgb(from var(--color-loud) r g b / 20%);
      border-color: rgb(from var(--color-loud) r g b);
      color: rgb(from var(--color-loud) r g b);
    }
  }

  svg {
    width: calc(var(--base-line) * var(--scale));
    height: calc(var(--base-line) * var(--scale));
    flex-shrink: 0;
  }

  /* calc won't work in the container query */
  @container (max-width: 6rem) {
    & > svg { margin: auto; }
    & > span { display: none; }
  }

  /* calc won't work in the container query */
  &[data-scale=2] {
    @container (max-width: 12rem) {
      & > svg { margin: auto; }
      & > span { display: none; }
    }
  }
`;
