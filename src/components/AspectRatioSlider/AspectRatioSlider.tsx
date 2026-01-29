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
        data-component="AspectRatioControl"
      />
      <AspectRatioRuler aspectRatioList={aspectRatioList} data-component="AspectRatioRuler" />
    </AspectRatioSliderWrapper>
  );
}
