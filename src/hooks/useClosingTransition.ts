import { useCallback, useEffect, useRef, useState } from "react";

export const CLOSING_FADE_MS = 132;

/** Delay in ms before starting the closing transition (e.g. after drop or file selection). */
export const BACKDROP_HIDE_DELAY_MS = 300;

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

export type UseDelayedCloseOptions = {
  /** Called after the delay to start the close (e.g. requestClose from useClosingTransition). */
  onSchedule: () => void;
  /** Delay in ms before calling onSchedule. Defaults to BACKDROP_HIDE_DELAY_MS. */
  delayMs?: number;
};

export type UseDelayedCloseResult = {
  /** Schedule the delayed close. No-op if already scheduled. */
  scheduleClose: () => void;
  /** Cancel any pending scheduled close. */
  cancelScheduledClose: () => void;
};

/**
 * Schedules a callback after a delay. Used with useClosingTransition to add a
 * delay before starting the closing transition (e.g. after drop or file selection).
 */
export function useDelayedClose({
  onSchedule,
  delayMs = BACKDROP_HIDE_DELAY_MS,
}: UseDelayedCloseOptions): UseDelayedCloseResult {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onScheduleRef = useRef(onSchedule);
  onScheduleRef.current = onSchedule;

  const cancelScheduledClose = useCallback(() => {
    if (timeoutRef.current != null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    if (timeoutRef.current != null) return;
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      onScheduleRef.current();
    }, delayMs);
  }, [delayMs]);

  useEffect(() => cancelScheduledClose, [cancelScheduledClose]);

  return { scheduleClose, cancelScheduledClose };
}
