import { useCallback } from "react";
import { type FileRejection, useDropzone } from "react-dropzone";
import { processResults } from "../../helpers/errorHandling";
import { Overlay } from "./FullScreenDropZone.styled";
import { processImageFilesWithErrorHandling } from "./helpers/processImageFilesWithErrorHandling";
import { useImageUploadHandlers } from "./hooks/useImageUploadHandlers";
import type { FullScreenDropZoneProps } from "./types";

const IMAGE_ACCEPT = {
  "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif"],
} as const;

/**
 * Build a FileList-like from an array of File for use with processImageFilesWithErrorHandling.
 */
function fileListFromFiles(files: File[]): FileList {
  const list = {
    length: files.length,
    item: (i: number) => files[i] ?? null,
    ...Object.fromEntries(files.map((f, i) => [i, f])),
  } as unknown as FileList;
  return list;
}

export function FullScreenDropZone({ onImageUpload, onImagesUpload }: FullScreenDropZoneProps) {
  const { stableOnImageUpload, stableOnImagesUpload } = useImageUploadHandlers({
    onImageUpload,
    onImagesUpload,
  });

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      for (const rejection of fileRejections) {
        for (const err of rejection.errors) {
          console.error("Error uploading image:", err.message);
        }
      }

      if (acceptedFiles.length === 0) return;

      const fileList = fileListFromFiles(acceptedFiles);
      const { accepted, rejected } = processResults(processImageFilesWithErrorHandling(fileList));

      stableOnImageUpload(accepted[0]);
      stableOnImagesUpload(accepted);

      for (const error of rejected) {
        console.error("Error uploading image:", error);
      }
    },
    [stableOnImageUpload, stableOnImagesUpload],
  );

  const { getRootProps, getInputProps, isDragGlobal } = useDropzone({
    noClick: true,
    noKeyboard: true,
    accept: IMAGE_ACCEPT,
    onDrop,
    multiple: onImagesUpload != null,
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
