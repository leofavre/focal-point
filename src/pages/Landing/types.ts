import type { Ref } from "react";
import type { ImageDraftStateAndFile } from "../../types";

export type LandingProps = {
  ref?: Ref<HTMLDivElement>;
  uploaderButtonRef?: Ref<HTMLButtonElement>;
  onImageUpload: (draftAndFile: ImageDraftStateAndFile | undefined) => void;
};
