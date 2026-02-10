import type { ChangeEvent, FormEvent } from "react";
import { useCallback, useEffect, useEffectEvent, useRef, useState } from "react";
import { useMergeRefs } from "react-merge-refs";
import { type Err, processResults } from "../../helpers/errorHandling";
import { IconUpload } from "../../icons/IconUpload";
import type { ImageDraftStateAndFile } from "../../types";
import { ToggleButton } from "../ToggleButton/ToggleButton";
import { processImageFilesWithErrorHandling } from "./helpers/processImageFilesWithErrorHandling";
import { InvisibleControl, InvisibleForm, InvisibleLabel } from "./ImageUploader.styled";
import type { ImageUploaderButtonProps } from "./types";

export function ImageUploaderButton({
  ref,
  size = "small",
  onImageUpload,
  onImagesUpload,
  onImageUploadError,
  onImagesUploadError,
  ...rest
}: ImageUploaderButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mergedRefs = useMergeRefs([ref, buttonRef]);

  const [isOpened, setIsOpened] = useState(false);

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

  const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { accepted, rejected } = processResults(
      processImageFilesWithErrorHandling(event.currentTarget?.files ?? null),
    );

    if (accepted.length > 0) {
      stableOnImageUpload(accepted[0]);
      stableOnImagesUpload(accepted);
    }

    if (rejected.length > 0) {
      stableOnImageUploadError(rejected[0]);
      stableOnImagesUploadError(rejected);
    }

    if (event.currentTarget == null) return;
    event.currentTarget.value = "";
  }, []);

  const handleFormSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }, []);

  const stableInputRefGetter = useEffectEvent(() => inputRef.current);
  const setClosed = useEffectEvent(() => setIsOpened(false));

  /**
   * When a file is selected, upload it and close the file manager.
   */
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      handleFileChange(event);
      setClosed();
    },
    [handleFileChange],
  );

  /**
   * When the button is clicked, open the file manager by clicking the hidden input element.
   */
  const handleButtonClick = useCallback(() => {
    inputRef?.current?.click();
    setIsOpened(true);
  }, []);

  /**
   * If the user cancels the file upload, close the file manager.
   */
  useEffect(() => {
    const node = stableInputRefGetter();

    if (node == null) return;
    node.addEventListener("cancel", setClosed);

    return () => {
      if (node == null) return;
      node.removeEventListener("cancel", setClosed);
    };
  }, []);

  return (
    <InvisibleForm data-component="ImageUploaderButton" onSubmit={handleFormSubmit} {...rest}>
      <InvisibleLabel>
        <InvisibleControl
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={onImagesUpload != null}
          onChange={handleChange}
          tabIndex={-1}
        />
        <ToggleButton
          ref={mergedRefs}
          type="button"
          toggled={isOpened}
          onClick={handleButtonClick}
          titleOn="Upload"
          titleOff="Upload"
          icon={<IconUpload />}
          scale={size === "medium" ? 2 : size === "large" ? 4 : 1}
        />
      </InvisibleLabel>
    </InvisibleForm>
  );
}
