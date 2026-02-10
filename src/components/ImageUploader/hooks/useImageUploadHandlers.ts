import type { ChangeEvent, FormEvent } from "react";
import { useCallback, useEffectEvent } from "react";
import { type Err, processResults } from "../../../helpers/errorHandling";
import type { ImageDraftStateAndFile } from "../../../types";
import { processImageFilesWithErrorHandling } from "../helpers/processImageFilesWithErrorHandling";
import type { ImageUploaderProps } from "../types";

type UseImageUploadHandlersProps = Pick<
  ImageUploaderProps,
  "onImageUpload" | "onImagesUpload" | "onImageUploadError" | "onImagesUploadError"
>;

export function useImageUploadHandlers({
  onImageUpload,
  onImagesUpload,
  onImageUploadError,
  onImagesUploadError,
}: UseImageUploadHandlersProps) {
  const stableOnImageUpload = useEffectEvent((draftAndFile: ImageDraftStateAndFile) =>
    onImageUpload?.(draftAndFile),
  );
  const stableOnImagesUpload = useEffectEvent((draftsAndFiles: ImageDraftStateAndFile[]) =>
    onImagesUpload?.(draftsAndFiles),
  );
  const stableOnImageUploadError = useEffectEvent((error: Err<string>) =>
    onImageUploadError?.(error),
  );
  const stableOnImagesUploadError = useEffectEvent((errors: Err<string>[]) =>
    onImagesUploadError?.(errors),
  );

  const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { accepted, rejected } = processResults(
      processImageFilesWithErrorHandling(event.currentTarget?.files ?? null),
    );

    if (accepted.length > 0) {
      stableOnImageUpload(accepted[0]);
      stableOnImagesUpload(accepted);
    }

    if (rejected.length > 0) {
      stableOnImageUploadError(rejected[0]);
      stableOnImagesUploadError(rejected);
    }

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
