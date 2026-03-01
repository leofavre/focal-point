import { useCallback, useRef, useState } from "react";

export const CLOSING_FADE_MS = 132;

export type UseClosingTransitionOptions = {
  /** Called after the fade-out completes. Perform the actual close (e.g. hidePopover, dialog.close). */
  onClose: () => void;
  /** Duration of the closing fade in ms. Defaults to CLOSING_FADE_MS. */
  fadeMs?: number;
};

export type UseClosingTransitionResult = {
  /** True while the backdrop/content is fading out. Add data-closing to your element for CSS. */
  isClosing: boolean;
  /** Start the closing sequence: fade out, then call onClose. */
  requestClose: () => void;
  /** Cancel any pending close and reset isClosing. */
  cancelClose: () => void;
};

/**
 * Shared hook for backdrop/content fade-out before closing.
 * Use with data-closing attribute and matching CSS for the fade animation.
 */
export function useClosingTransition({
  onClose,
  fadeMs = CLOSING_FADE_MS,
}: UseClosingTransitionOptions): UseClosingTransitionResult {
  const [isClosing, setIsClosing] = useState(false);
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const cancelClose = useCallback(() => {
    if (fadeTimeoutRef.current != null) {
      clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = null;
    }
    setIsClosing(false);
  }, []);

  const requestClose = useCallback(() => {
    setIsClosing(true);
    fadeTimeoutRef.current = setTimeout(() => {
      fadeTimeoutRef.current = null;
      onCloseRef.current();
      setIsClosing(false);
    }, fadeMs);
  }, [fadeMs]);

  return { isClosing, requestClose, cancelClose };
}
