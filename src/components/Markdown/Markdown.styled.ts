import styled from "@emotion/styled";

export const Wrapper = styled.div`
  --base-line: 22;
  display: contents;

  & > div {
    display: contents;
  }

  h1,
  h2,
  p,
  ol,
  ul,
  li {
    margin: 0;
    padding: 0;
  }
  
  /* Title */
  h1 {
    display: none;
  }
  
  /* Punch line*/
  h1 + p {
    display: none;
  }
  
  /* Steps */
  h2 {
    display: none;
  }
  
  ol {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(22ch, 1fr));
    gap: 2rem;
    width: 100%;
    max-width: 60rem;
  }

  li {
    list-style-type: none;
    text-wrap: balance;

    display: flex;
    flex-direction: column;
  }

  /* Step Title */
  ol > li > p {
    font-family: "Sono", monospace;
    font-optical-sizing: auto;
    font-size: calc(21 / 16 * 1rem);
    line-height: calc(var(--base-line) / 16 * 1rem);
    font-weight: 300;
    text-transform: uppercase;
    word-spacing: -0.5ch;
    color: var(--color-neutral);

    display: flex;
    align-items: end;
    margin-bottom: calc((var(--base-line) / 2) / 16 * 1rem);
    min-height: calc((var(--base-line) * 2) / 16 * 1rem);
  }

  /* Step Description */
  ul > li {
    font-size: calc(16 / 16 * 1rem);
    line-height: calc(var(--base-line) / 16 * 1rem);
    font-weight: 400;
  }
`;
