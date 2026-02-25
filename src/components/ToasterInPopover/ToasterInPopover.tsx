import { useEffect, useRef } from "react";
import { Toaster, useToasterStore } from "react-hot-toast";
import { Wrapper } from "./ToasterInPopover.styled";

const POPOVER_HIDE_DELAY_MS = 400;

const supportsPopover =
  typeof HTMLElement !== "undefined" &&
  typeof (HTMLElement.prototype as HTMLElement & { showPopover?: () => void }).showPopover ===
    "function";

export function ToasterInPopover() {
  const popoverRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { toasts } = useToasterStore();

  useEffect(() => {
    if (!supportsPopover || popoverRef.current == null) return;

    const el = popoverRef.current;

    if (toasts.length > 0) {
      if (hideTimeoutRef.current != null) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      // Re-open if popover was closed (e.g. after content update when second toast added)
      if (!el.matches(":popover-open")) {
        el.showPopover();
      }
    } else {
      hideTimeoutRef.current = setTimeout(() => {
        hideTimeoutRef.current = null;
        const current = popoverRef.current as
          | (HTMLDivElement & { hidePopover?: () => void })
          | null;
        current?.hidePopover?.();
      }, POPOVER_HIDE_DELAY_MS);
    }

    return () => {
      if (hideTimeoutRef.current != null) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    };
  }, [toasts.length]);

  return (
    <Wrapper ref={popoverRef} {...(supportsPopover ? { popover: "auto" as const } : {})}>
      <Toaster position="top-center" />
    </Wrapper>
  );
}
