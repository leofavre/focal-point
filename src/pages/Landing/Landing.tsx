import { HowToUse } from "../../components/HowToUse/HowToUse";
import { ImageUploaderButton } from "../../components/ImageUploader/ImageUploaderButton";
import { LandingWrapper } from "./Landing.styled";
import type { LandingProps } from "./types";

export function Landing({ ref, uploaderButtonRef, onImageUpload, ...rest }: LandingProps) {
  return (
    <LandingWrapper ref={ref} data-component="Landing" {...rest}>
      <ImageUploaderButton ref={uploaderButtonRef} size="medium" onImageUpload={onImageUpload} />
      <HowToUse />
    </LandingWrapper>
  );
}
