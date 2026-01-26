import styled from "@emotion/styled";
import { AspectRatioControl } from "./AspectRatioControl/AspectRatioControl";
import type { AspectRatioControlProps } from "./AspectRatioControl/types";
import { AspectRatioRuler } from "./AspectRatioRuler/AspectRatioRuler";

const AspectRatioSliderWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
`;

export function AspectRatioSlider({
  aspectRatio,
  aspectRatioList,
  onAspectRatioChange,
  ...rest
}: AspectRatioControlProps) {
  return (
    <AspectRatioSliderWrapper {...rest}>
      <AspectRatioControl
        aspectRatio={aspectRatio}
        aspectRatioList={aspectRatioList}
        onAspectRatioChange={onAspectRatioChange}
      />
      <AspectRatioRuler
        aspectRatioList={aspectRatioList}
        /** @todo Move inline static CSS into AspectRatioSlider > AspectRatioRuler */
        css={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}
      />
    </AspectRatioSliderWrapper>
  );
}
