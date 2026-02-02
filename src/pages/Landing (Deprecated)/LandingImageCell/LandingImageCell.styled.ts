import styled from "@emotion/styled";
import { Link } from "react-router-dom";

export const CellWrapper = styled.div`
  overflow: hidden;

  &[data-proportion="square"] {
    aspect-ratio: 1 / 1;
  }

  &[data-proportion="horizontal"] {
    grid-column: span 2;
  }

  &[data-proportion="vertical"] {
    grid-row: span 2;
  }
`;

export const CellLink = styled(Link)`
  display: block;
  width: 100%;
  height: 100%;
`;

export const CellImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: var(--object-position, 50% 50%);
  display: block;
`;
