import styled from "@emotion/styled";

export const Form = styled.form`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem 1rem 1rem 4rem;
  background-color: rgb(from var(--color-neutral) r g b / 5%);
  border: 1px dashed var(--color-body);
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;
  cursor: pointer;
  box-sizing: border-box;

  * {
    cursor: pointer;
  }

  &[data-drag-over] {
    background-color: rgb(from var(--color-neutral) r g b / 10%);
  }

  &[data-variant="small"] {
    display: block;
    padding: 0;
    border: none;
    background: none;
  }

  &[data-variant="large"] {
    width: 100%;
    aspect-ratio: 2 / 1;
  }
`;

export const DropZone = styled.label`
  position: absolute;
  inset: 0;
`;

export const HiddenControl = styled.input`
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
`;
