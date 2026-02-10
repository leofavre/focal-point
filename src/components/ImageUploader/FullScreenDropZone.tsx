import { useCallback, useEffectEvent } from "react";
import { type FileRejection, useDropzone } from "react-dropzone";
import type { Err } from "../../helpers/errorHandling";
import type { ImageDraftState, ImageDraftStateAndFile } from "../../types";
import { Overlay } from "./FullScreenDropZone.styled";
import type { FullScreenDropZoneProps } from "./types";

const IMAGE_ACCEPT = {
  "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif"],
} as const;

export function FullScreenDropZone({
  onImageUpload,
  onImagesUpload,
  onImageUploadError,
  onImagesUploadError,
}: FullScreenDropZoneProps) {
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

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    const accepted = acceptedFiles.map((file) => {
      const imageDraft: ImageDraftState = {
        name: file.name,
        type: file.type,
        createdAt: Date.now(),
        breakpoints: [],
      };

      return { imageDraft, file };
    });

    /**
     * @todo Maybe add more rejections per file if we want to show more
     * information to the user in the UI. For now, I'm keeping this simple.
     */
    const rejected = fileRejections.map((rejection) => {
      return {
        reason: rejection.errors[0].code,
      };
    });

    if (accepted.length > 0) {
      stableOnImageUpload(accepted[0]);
      stableOnImagesUpload(accepted);
    }

    if (rejected.length > 0) {
      stableOnImageUploadError(rejected[0]);
      stableOnImagesUploadError(rejected);
    }
  }, []);

  const { getRootProps, getInputProps, isDragGlobal } = useDropzone({
    noClick: true,
    noKeyboard: true,
    accept: IMAGE_ACCEPT,
    onDrop,
    multiple: true,
  });

  if (!isDragGlobal) return null;

  return (
    <Overlay
      {...getRootProps()}
      data-component="FullScreenDropZone"
      aria-hidden
      style={{ pointerEvents: "auto" }}
    >
      <input {...getInputProps()} />
    </Overlay>
  );
}
