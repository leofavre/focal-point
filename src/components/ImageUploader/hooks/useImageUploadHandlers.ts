import { type ChangeEvent, type FormEvent, useCallback, useEffectEvent } from "react";
import type { ImageDraftStateAndFile } from "../../../types";
import { processImageFiles } from "../helpers/processImageFiles";
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
    try {
      const imageDraftStatesAndFiles = processImageFiles(event.currentTarget.files);
      stableOnImageUpload(imageDraftStatesAndFiles[0]);
      stableOnImagesUpload(imageDraftStatesAndFiles);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      if (event.currentTarget != null) {
        event.currentTarget.value = "";
      }
    }
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
