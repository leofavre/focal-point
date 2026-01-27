import styled from "@emotion/styled";
import type { AspectRatioRulerProps } from "./types";

const AspectRatioRulerList = styled.ul`
  position: relative;
  display: flex;
  margin: 0;
  align-items: flex-start;
  font-size: 0.75rem;
  color: #94a3b8;
`;

const AspectRatioRulerItem = styled.li`
  width: 0.0625rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  writing-mode: sideways-lr;
`;

const AspectRatioRulerLabel = styled.span`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;

  &::after {
    content: "";
    margin-bottom: 0.25rem;
    display: inline-block;
    width: 0.0625rem;
    height: 1.5rem;
    background-color: #94a3b8;
    vertical-align: middle;
  }
`;

export function AspectRatioRuler({ ref, aspectRatioList, ...rest }: AspectRatioRulerProps) {
  return (
    <AspectRatioRulerList ref={ref} {...rest}>
      {aspectRatioList.map(({ name, position }) => {
        return (
          <AspectRatioRulerItem key={name} css={{ left: `${position * 100}%` }}>
            <AspectRatioRulerLabel>{name}</AspectRatioRulerLabel>
          </AspectRatioRulerItem>
        );
      })}
    </AspectRatioRulerList>
  );
}
