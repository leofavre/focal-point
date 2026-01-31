import type { RefObject } from "react";
import type { ImageState } from "../../types";

export type ImageUploaderProps = {
  ref?: RefObject<HTMLInputElement | null>;
  onImageUpload?: (imageState: ImageState | null, file: File | null) => void;
};
