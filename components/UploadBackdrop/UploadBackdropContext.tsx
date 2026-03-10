import type { Ref } from "react";
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { mergeRefs } from "react-merge-refs";
import { useAppContext } from "@/src/AppContext";
import { parseBooleanAttr } from "@/src/helpers/parseBooleanAttr";
import { useClosingTransition, useDelayedClose } from "@/src/hooks/useClosingTransition";
import type { ImageDraftStateAndFile, ImageDraftStateAndUrl } from "@/src/types";
import { BackdropOverlay } from "../BackdropOverlay/BackdropOverlay.styled";

export type UploadBackdropMode = "hidden" | "dropzone" | "filepicker";

/** Root props passed from FullScreenDropZone (e.g. from react-dropzone getRootProps()). */
export type UploadBackdropRootProps = Record<string, unknown> & {
  ref?: Ref<HTMLDivElement | null>;
};

export type UploadBackdropContextValue = {
  showDropZone: (rootProps: UploadBackdropRootProps, children: React.ReactNode) => void;
  /** Shows the backdrop with the file input. Callback is invoked after the popover is visible and the input is mounted (use it to call open()). */
  showFilePicker: (children: React.ReactNode, onShown?: () => void) => void;
  scheduleHide: () => void;
  cancelScheduledHide: () => void;
  hidePopoverRef: React.RefObject<HTMLDivElement | null>;
  /** Current upload handler from AppContext. Use this when wiring dropzone/filepicker so uploads always use the latest handler (avoids stale closures when backdrop content is rendered in provider). */
  getUploadHandler: () =>
    | ((draft: ImageDraftStateAndFile | ImageDraftStateAndUrl) => Promise<void>)
    | undefined;
};

const UploadBackdropContextInstance = createContext<UploadBackdropContextValue | null>(null);

export function useUploadBackdrop(): UploadBackdropContextValue {
  const ctx = useContext(UploadBackdropContextInstance);
  if (ctx == null) {
    throw new Error("useUploadBackdrop must be used within UploadBackdropProvider");
  }
  return ctx;
}

export function UploadBackdropProvider({ children }: PropsWithChildren) {
  const { handleImageUpload } = useAppContext();
  const uploadHandlerRef = useRef(handleImageUpload);
  uploadHandlerRef.current = handleImageUpload;

  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [mode, setMode] = useState<UploadBackdropMode>("hidden");
  const [dropzoneRootProps, setDropzoneRootProps] = useState<UploadBackdropRootProps>({});
  const [dropzoneChildren, setDropzoneChildren] = useState<React.ReactNode>(null);
  const [filePickerChildren, setFilePickerChildren] = useState<React.ReactNode>(null);
  const filePickerOnShownRef = useRef<(() => void) | null>(null);

  const getUploadHandler = useCallback(() => uploadHandlerRef.current, []);

  const stableHidePopover = useCallback(() => {
    popoverRef.current?.hidePopover();
  }, []);

  const { isClosing, requestClose, cancelClose } = useClosingTransition({
    onClose: () => {
      stableHidePopover();
      setMode("hidden");
      setDropzoneRootProps({});
      setDropzoneChildren(null);
      setFilePickerChildren(null);
    },
  });

  const { scheduleClose, cancelScheduledClose } = useDelayedClose({
    onSchedule: requestClose,
  });

  const showDropZone = useCallback(
    (rootProps: UploadBackdropRootProps, children: React.ReactNode) => {
      cancelScheduledClose();
      cancelClose();
      setDropzoneRootProps(rootProps);
      setDropzoneChildren(children);
      setFilePickerChildren(null);
      setMode("dropzone");
    },
    [cancelClose, cancelScheduledClose],
  );

  const showFilePicker = useCallback((children: React.ReactNode, onShown?: () => void) => {
    filePickerOnShownRef.current = onShown ?? null;
    setDropzoneRootProps({});
    setDropzoneChildren(null);
    setFilePickerChildren(children);
    setMode("filepicker");
  }, []);

  const scheduleHide = useCallback(() => {
    scheduleClose();
  }, [scheduleClose]);

  useEffect(() => {
    if (mode === "hidden" || popoverRef.current == null) return;
    popoverRef.current.showPopover();
    if (mode === "filepicker") {
      filePickerOnShownRef.current?.();
      filePickerOnShownRef.current = null;
    }
  }, [mode]);

  const value: UploadBackdropContextValue = {
    showDropZone,
    showFilePicker,
    scheduleHide,
    cancelScheduledHide: cancelScheduledClose,
    hidePopoverRef: popoverRef,
    getUploadHandler,
  };

  const isOpen = mode !== "hidden";
  const rootProps = mode === "dropzone" ? dropzoneRootProps : {};
  const mergedRef =
    mode === "dropzone" && rootProps.ref != null
      ? mergeRefs([popoverRef, rootProps.ref as Ref<HTMLDivElement | null>])
      : popoverRef;
  const { ref: _dropzoneRef, ...rootPropsWithoutRef } = dropzoneRootProps;

  return (
    <UploadBackdropContextInstance.Provider value={value}>
      {children}
      <BackdropOverlay
        ref={mergedRef}
        popover="manual"
        data-closing={parseBooleanAttr(isClosing)}
        {...(mode === "dropzone" ? rootPropsWithoutRef : {})}
        data-component={mode === "dropzone" ? "FullScreenDropZone" : "ImageUploaderButtonOverlay"}
        aria-hidden={!isOpen}
      >
        {mode === "dropzone" && dropzoneChildren}
        {mode === "filepicker" && filePickerChildren}
      </BackdropOverlay>
    </UploadBackdropContextInstance.Provider>
  );
}
