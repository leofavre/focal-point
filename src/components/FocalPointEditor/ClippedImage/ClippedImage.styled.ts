import styled from "@emotion/styled";

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  pointer-events: none;
  touch-action: none;
  user-select: none;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    touch-action: none;
    user-select: none;
  }
`;
