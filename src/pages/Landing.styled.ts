import styled from "@emotion/styled";

export const LandingGrid = styled.main`
  display: grid;
  grid-template-columns: 1fr minmax(20rem, 60rem) 1fr;
  grid-auto-rows: min-content;
  gap: 0;
  margin: 1rem;
  width: calc(100dvw - 2rem);
  isolation: isolate;

  [data-component="ImageUploader"] {
    grid-column: 2;
    height: 15rem;
  }

  [data-component="Markdown"] {
    h1, h2, p, ol, ul, li {
      margin: 0;
      padding: 0;
      line-height: 2ex;
      text-box: trim-both cap alphabetic;
    }

    h1, h2 {
      line-height: 1.75ex;
    }

    h1 {
      grid-column: 2;
      margin: 3rem 0 1.25rem;
      font-family: "Space Grotesk", system-ui, sans-serif;
      font-size: clamp(3.5rem, 14vw, 7rem);
      font-weight: 700;
      letter-spacing: -0.03em;
      color: var(--landing-fg-heading);
    }

    h1 + p {
      grid-column: 2;
      font-size: 1.125rem;
      font-weight: 400;
      color: var(--landing-fg-subtitle);
    }

    h2 {
      grid-column: 2;
      margin: 2rem 0 1rem;
      font-family: "Space Grotesk", system-ui, sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: var(--landing-fg-section);
    }

    ol {
      grid-column: 2;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(25ch, 1fr));
      gap: 2rem;
    }

    ol > li > p {
      font-size: 1.0625rem;
      font-weight: 700;
      line-height: 1.35;
      color: var(--landing-fg-step-title);
    }

    ul > li {
      font-size: 0.9375rem;
      font-weight: 400;
      line-height: 1.6;
      color: var(--landing-fg-step-body);
    }

    li {
      display: flex;
      flex-direction: column;
      list-style-type: none;
      text-wrap: balance;
    }

    p  {
      margin: 1rem 0;
    }
  }
`;
