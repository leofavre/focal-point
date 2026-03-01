import type { Ref } from "react";
import { useEffect, useRef } from "react";
import { mergeRefs } from "react-merge-refs";
import { Overlay } from "./FullScreenDropZone.styled";
import { useImageDropzone } from "./hooks/useImageDropzone";
import type { FullScreenDropZoneProps } from "./types";

const POPOVER_HIDE_DELAY_MS = 300;

export function FullScreenDropZone({
  onImageUpload,
  onImagesUpload,
  onImageUploadError,
  onImagesUploadError,
  onDragStart,
  ...rest
}: FullScreenDropZoneProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { getRootProps, getInputProps, isDragGlobal } = useImageDropzone({
    onImageUpload,
    onImagesUpload,
    onImageUploadError,
    onImagesUploadError,
    noClick: true,
    noDrag: false,
    multiple: true,
  });

  const { ref: rootRef, ...rootProps } = getRootProps();
  const mergedRefs = mergeRefs([popoverRef, rootRef as Ref<HTMLDivElement | null>]);

  useEffect(() => {
    if (popoverRef.current == null) return;

    if (isDragGlobal) {
      if (hideTimeoutRef.current != null) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      onDragStart?.();
      popoverRef.current.showPopover();
    } else {
      hideTimeoutRef.current = setTimeout(() => {
        hideTimeoutRef.current = null;
        popoverRef.current?.hidePopover();
      }, POPOVER_HIDE_DELAY_MS);
    }

    return () => {
      if (hideTimeoutRef.current != null) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    };
  }, [isDragGlobal, onDragStart]);

  return (
    <Overlay
      ref={mergedRefs}
      popover="manual"
      {...rootProps}
      data-component="FullScreenDropZone"
      aria-hidden
      {...rest}
    >
      <input {...getInputProps()} aria-hidden />
      <p>Drop an image here</p>
    </Overlay>
  );
}
