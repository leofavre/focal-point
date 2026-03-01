import type { Ref } from "react";
import { useEffect, useEffectEvent, useRef } from "react";
import { mergeRefs } from "react-merge-refs";
import { useClosingTransition } from "../../hooks/useClosingTransition";
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

  const stableHidePopover = useEffectEvent(() => {
    popoverRef.current?.hidePopover();
  });

  const { isClosing, requestClose, cancelClose } = useClosingTransition({
    onClose: stableHidePopover,
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
      cancelClose();
      onDragStart?.();
      popoverRef.current.showPopover();
    } else {
      hideTimeoutRef.current = setTimeout(() => {
        hideTimeoutRef.current = null;
        requestClose();
      }, POPOVER_HIDE_DELAY_MS);
    }

    return () => {
      if (hideTimeoutRef.current != null) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    };
  }, [isDragGlobal, onDragStart, requestClose, cancelClose]);

  return (
    <Overlay
      ref={mergedRefs}
      popover="manual"
      data-closing={isClosing || undefined}
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
