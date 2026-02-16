import styled from "@emotion/styled";
import { CodeBlock } from "react-code-block";

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  transition: transform 0.15s ease;
  display: flex;
  flex-flow: column;
`;

export const TabBar = styled.div`
  display: flex;
  gap: 0.25rem;
`;

export const TabButton = styled.button`
  padding: 0.25rem 0.5rem;
  font-size: 0.8125rem;
  font-family: inherit;
  color: var(--color-neutral);
  background-color: var(--color-body);
  border: 1px solid var(--color-neutral);
  border-radius: 0.375rem 0.375rem 0 0;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;

  &[aria-selected="true"] {
    color: var(--color-zero);
    background-color: var(--color-body);
    border: 1px solid var(--color-body);
  }

  @media (hover: hover) {
    &:hover:not(:disabled) {
      color: var(--color-zero);
      background-color: var(--color-body);
    }
  }
  @media (hover: none) {
    &:active:not(:disabled) {
      color: var(--color-zero);
      background-color: var(--color-body);
    }
  }

  &:focus-visible {
    outline: 2px solid var(--color-glow);
  }
`;

export const Code = styled(CodeBlock.Code)`
  font-size: 1rem;
  margin: 0;
  box-sizing: border-box;
  background-color: var(--color-body);
  padding: var(--base-line);
  overflow: auto;
  transition: opacity 0.15s ease;
  flex-grow: 1;
`;

export const Line = styled.div`
  display: table-row;
`;

export const LineNumber = styled(CodeBlock.LineNumber)`
  display: table-cell;
  padding-right: 1rem;
  font-size: 0.875rem;
  color: var(--color-neutral);
  text-align: right;
  user-select: none;
`;

export const LineContent = styled(CodeBlock.LineContent)`
  display: table-cell;
`;

export const CopyButton = styled.button`
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-family: inherit;
  color: var(--color-neutral);
  background-color: var(--color-body);
  border: 1px solid var(--color-neutral);
  border-radius: 0.375rem;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: color 0.15s ease, background-color 0.15s ease, border-color 0.15s ease;

  @media (hover: hover) {
    &:hover {
      color: var(--color-zero);
      background-color: var(--color-neutral-tint-30);
      border-color: var(--color-neutral);
    }
  }
  @media (hover: none) {
    &:active {
      color: var(--color-zero);
      background-color: var(--color-neutral-tint-30);
      border-color: var(--color-neutral);
    }
  }

  &:focus-visible {
    outline: 2px solid var(--color-glow);
  }
`;
