import styled from "@emotion/styled";

export const DocPageLayout = styled.article`
  grid-column: 1 / -1;
  grid-row: 1 / -2;
  margin: auto;
  padding: var(--base-line-2x);
  max-width: 48rem;
  width: 100%;
  box-sizing: border-box;

  h1 {
    font-size: calc(28 / 16 * 1rem);
    line-height: var(--base-line-2x);
    font-weight: 500;
    color: var(--color-loud);
    margin: 0 0 var(--base-line-2x) 0;
  }

  h2 {
    font-size: calc(18 / 16 * 1rem);
    line-height: var(--base-line-15x);
    font-weight: 500;
    color: var(--color-body);
    margin: var(--base-line-2x) 0 var(--base-line-05x) 0;
  }

  p {
    font-size: calc(16 / 16 * 1rem);
    line-height: var(--base-line-15x);
    color: var(--color-neutral);
    margin: 0 0 var(--base-line-1x) 0;
  }

  p:last-child {
    margin-bottom: 0;
  }

  a {
    color: var(--color-cool);
    text-decoration: underline;
  }

  a:hover {
    color: var(--color-loud);
  }

  dl {
    margin: 0 0 var(--base-line-1x) 0;
  }

  dt {
    font-size: calc(16 / 16 * 1rem);
    font-weight: 500;
    color: var(--color-body);
    margin: var(--base-line-1x) 0 var(--base-line-05x) 0;
  }

  dt:first-of-type {
    margin-top: 0;
  }

  dd {
    font-size: calc(16 / 16 * 1rem);
    line-height: var(--base-line-15x);
    color: var(--color-neutral);
    margin: 0 0 0 1.5em;
  }
`;

export const DocPageMeta = styled.p`
  font-size: calc(14 / 16 * 1rem);
  color: var(--color-neutral);
  margin-bottom: var(--base-line-2x);
`;

export const Kbd = styled.kbd`
  display: inline-block;
  padding: 0.15em 0.4em;
  font-family: inherit;
  font-size: 0.9em;
  color: var(--color-body);
  background: var(--color-subtle, #eee);
  border: 1px solid var(--color-border, #ccc);
  box-shadow: 0 1px 0 var(--color-border, #ccc);
`;
