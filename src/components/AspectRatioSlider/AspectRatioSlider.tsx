import { AspectRatioControl } from "./AspectRatioControl/AspectRatioControl";
import type { AspectRatioControlProps } from "./AspectRatioControl/types";
import { AspectRatioRuler } from "./AspectRatioRuler/AspectRatioRuler";
import { AspectRatioSliderWrapper } from "./AspectRatioSlider.styled";

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
        /** @todo Move inline static CSS into AspectRatioSlider > AspectRatioRuler */
        css={{ position: "relative", zIndex: 1 }}
      />
      <AspectRatioRuler
        aspectRatioList={aspectRatioList}
        /** @todo Move inline static CSS into AspectRatioSlider > AspectRatioRuler */
        css={{
          position: "relative",
          marginLeft: "0.46875rem",
          marginRight: "0.53125rem",
          marginTop: "-0.75rem",
          zIndex: 0,
        }}
      />
    </AspectRatioSliderWrapper>
  );
}
