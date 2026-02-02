import type { RefObject } from "react";
import type { ImageDraftState } from "../../types";

export type ImageDraftStateAndFile = {
  imageDraftState: ImageDraftState;
  file: File;
};

export type ImageUploaderProps = {
  ref?: RefObject<HTMLInputElement | null>;
  onImageUpload?: (event: ImageDraftStateAndFile[]) => void;
};
