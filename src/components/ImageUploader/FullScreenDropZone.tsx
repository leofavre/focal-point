import { Overlay } from "./FullScreenDropZone.styled";
import { useImageDropzone } from "./hooks/useImageDropzone";
import type { FullScreenDropZoneProps } from "./types";

export function FullScreenDropZone({
  onImageUpload,
  onImagesUpload,
  onImageUploadError,
  onImagesUploadError,
  ...rest
}: FullScreenDropZoneProps) {
  const { getRootProps, getInputProps, isDragGlobal } = useImageDropzone({
    onImageUpload,
    onImagesUpload,
    onImageUploadError,
    onImagesUploadError,
    noClick: true,
    noDrag: false,
    multiple: true,
  });

  return (
    <Overlay
      {...getRootProps()}
      data-component="FullScreenDropZone"
      aria-hidden
      css={{
        opacity: isDragGlobal ? 1 : 0,
        pointerEvents: isDragGlobal ? "auto" : "none",
      }}
      {...rest}
    >
      {<input {...getInputProps()} aria-hidden />}
      <p>Drop an image here</p>
    </Overlay>
  );
}
