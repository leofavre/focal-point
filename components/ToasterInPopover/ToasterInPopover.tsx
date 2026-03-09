import { useEffect, useRef } from "react";
import type { Toast } from "react-hot-toast";
import { ToastBar, Toaster } from "react-hot-toast";
import { BACKDROP_HIDE_DELAY_MS } from "@/src/hooks/useClosingTransition";
import { Wrapper } from "./ToasterInPopover.styled";

function ToastPopover({ toast, children }: { toast: Toast; children: React.ReactNode }) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (popoverRef.current == null) return;
    popoverRef.current.showPopover();
  }, []);

  useEffect(() => {
    if (popoverRef.current == null) return;

    if (toast.visible) {
      if (hideTimeoutRef.current != null) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    } else {
      hideTimeoutRef.current = setTimeout(() => {
        hideTimeoutRef.current = null;
        popoverRef.current?.hidePopover();
      }, BACKDROP_HIDE_DELAY_MS);
    }

    return () => {
      if (hideTimeoutRef.current != null) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    };
  }, [toast.visible]);

  return (
    <Wrapper ref={popoverRef} popover="manual">
      {children}
    </Wrapper>
  );
}

export function ToasterInPopover() {
  return (
    <Toaster
      toastOptions={{
        style: {
          borderRadius: 0,
          opacity: 1,
        },
        success: {
          iconTheme: {
            primary: "var(--color-toast-success)",
            secondary: "#fff",
          },
        },
        error: {
          iconTheme: {
            primary: "var(--color-toast-error)",
            secondary: "#fff",
          },
        },
      }}
    >
      {(t) => {
        return (
          <ToastPopover toast={t}>
            <ToastBar toast={t} />
          </ToastPopover>
        );
      }}
    </Toaster>
  );
}
