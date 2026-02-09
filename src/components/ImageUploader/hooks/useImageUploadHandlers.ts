import { type ChangeEvent, type FormEvent, useCallback, useEffectEvent } from "react";
import type { Err } from "../../../helpers/errorHandling";
import type { ImageDraftStateAndFile } from "../../../types";
import { processImageFiles } from "../helpers/processImageFiles";
import {
  type ImageDraftStateAndFileError,
  processImageFilesWithErrorHandling,
} from "../helpers/processImageFilesWithErrorhandling";
import type { ImageUploaderProps } from "../types";

type UseImageUploadHandlersProps = Pick<ImageUploaderProps, "onImageUpload" | "onImagesUpload">;

export function useImageUploadHandlers({
  onImageUpload,
  onImagesUpload,
}: UseImageUploadHandlersProps) {
  const stableOnImageUpload = useEffectEvent((draftAndFile: ImageDraftStateAndFile | undefined) => {
    onImageUpload?.(draftAndFile);
  });

  const stableOnImagesUpload = useEffectEvent((draftsAndFiles: ImageDraftStateAndFile[]) => {
    onImagesUpload?.(draftsAndFiles);
  });

  const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    /**
     * @todo Create helper for this repeated block.
     */
    const processed = processImageFilesWithErrorHandling(event.currentTarget.files);
    const successes: ImageDraftStateAndFile[] = [];
    const errors: Err<ImageDraftStateAndFileError>[] = [];

    processed.forEach((result) => {
      if (result.success) {
        successes.push(result.success);
      } else {
        errors.push(result.error);
      }
    });

    stableOnImageUpload(successes[0]);
    stableOnImagesUpload(successes);

    /**
     * @todo Show error to the user in the UI.
     */
    errors.forEach((error) => {
      console.error("Error uploading image:", error);
    });

    if (event.currentTarget == null) return;
    event.currentTarget.value = "";
  }, []);

  const handleFormSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }, []);

  return {
    handleFileChange,
    handleFormSubmit,
    stableOnImageUpload,
    stableOnImagesUpload,
  };
}
