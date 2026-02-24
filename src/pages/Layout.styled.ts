import styled from "@emotion/styled";

/** Shared full-width message (loading, errors) in the main content area. */
export const LayoutMessage = styled.h3`
  grid-column: 1 / -1;
  grid-row: 1 / -2;
  margin: auto;
`;

export const LayoutGrid = styled.main`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 12ch) minmax(0, 12ch) minmax(8rem, 50rem) minmax(0, 12ch) minmax(0, 12ch) minmax(0, 1fr);
  grid-template-rows: 7rem 1fr auto;
  overflow: hidden;
  gap: var(--base-line-05x);
  margin: 0;
  width: 100dvw;
  min-height: 100dvh;

  [data-component="Landing"] {
    grid-column: 1 / -1;
    grid-row: 1 / -2;
    margin: auto;

    width: 100%;
    max-width: 70rem;
  }

  [data-component="FocalPointEditor"] {
    grid-row: 1 / 3;
    grid-column: 1 / -1;
    overflow: hidden;
  }

  [data-component="CodeSnippet"] {
    grid-row: 2 / 4;
    grid-column: 2 / -2;
    margin: auto auto 0 auto;
    width: clamp(25rem, 100dvw, 40rem);
  }

  > [data-component="AspectRatioSlider"] {
    position: relative;
    top: 8rem;
    grid-row: 3;
    grid-column: 4;
    margin-left: auto;
    margin-right: auto;
    max-width: 1200px;
    visibility: hidden;
    transition: top 132ms ease-in-out 0s, visibility 132ms linear 132ms;
  }

  > [data-component="FocalPointButton"] {
    position: relative;
    top: 8rem;
    grid-row: 3;
    grid-column: 2;
    margin-bottom: auto;
    visibility: hidden;
    transition: top 132ms ease-in-out 0s, visibility 132ms linear 132ms;
  }

  > [data-component="ImageOverflowButton"] {
    position: relative;
    top: 8rem;
    grid-row: 3;
    grid-column: 3;
    margin-bottom: auto;
    visibility: hidden;
    transition: top 132ms ease-in-out 0s, visibility 132ms linear 132ms;
  }

  > [data-component="CodeSnippetButton"] {
    position: relative;
    top: 8rem;
    grid-row: 3;
    grid-column: 5;
    margin-bottom: auto;
    visibility: hidden;
    transition: top 132ms ease-in-out 0s, visibility 132ms linear 132ms;
  }

  > [data-component="ImageUploaderButton"] {
    position: relative;
    top: 8rem;
    grid-row: 3;
    grid-column: 6;
    margin-bottom: auto;
    visibility: hidden;
    transition: top 132ms ease-in-out 0s, visibility 132ms linear 132ms;
  }

  [data-component="ImageUploaderButton"] {
    z-index: 8;
  }

  [data-component="FocalPoint"] {
    z-index: 5;
  }

  [data-component="HowToUse"] {
    z-index: 3;
  }

  &[data-has-bottom-bar] {
    > [data-component="AspectRatioSlider"],
    > [data-component="FocalPointButton"],
    > [data-component="ImageOverflowButton"],
    > [data-component="CodeSnippetButton"],
    > [data-component="ImageUploaderButton"] {
      top: 0;
      visibility: visible;
      transition: top 132ms ease-in-out 0s, visibility 132ms linear 0s;
    }
  }
`;
