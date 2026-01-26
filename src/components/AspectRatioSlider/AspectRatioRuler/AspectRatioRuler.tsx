import styled from "@emotion/styled";
import type { AspectRatioRulerProps } from "./types";

const AspectRatioRulerList = styled.ul`
  position: relative;
  display: flex;
  margin: 0;
  align-items: flex-start;
  font-size: 0.75rem;
  color: #6b7280;
`;

const AspectRatioRulerItem = styled.li`
  width: 1px;
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
    width: 1px;
    height: 0.75rem;
    background-color: #6b7280;
    vertical-align: middle;
  }
`;

export function AspectRatioRuler({ ref, aspectRatioList, ...rest }: AspectRatioRulerProps) {
  const min = aspectRatioList.at(0)?.preciseValue ?? 1;
  const max = aspectRatioList.at(-1)?.preciseValue ?? 1;

  return (
    <AspectRatioRulerList ref={ref} {...rest}>
      {aspectRatioList.map(({ name, preciseValue }) => {
        return (
          <AspectRatioRulerItem
            key={name}
            css={{ left: `${((preciseValue - min) / (max - min)) * 100}%` }}
          >
            <AspectRatioRulerLabel>{name}</AspectRatioRulerLabel>
          </AspectRatioRulerItem>
        );
      })}
    </AspectRatioRulerList>
  );
}
