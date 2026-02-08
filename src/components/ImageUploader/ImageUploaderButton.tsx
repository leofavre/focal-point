import { type ChangeEvent, type FormEvent, useCallback, useEffectEvent, useRef } from "react";
import { useMergeRefs } from "react-merge-refs";
import { IconUpload } from "../../icons/IconUpload";
import type { ImageDraftStateAndFile } from "../../types";
import { ToggleButton } from "../ToggleButton/ToggleButton";
import { processImageFiles } from "./helpers/processImageFiles";
import { InvisibleControl, InvisibleForm, InvisibleLabel } from "./ImageUploader.styled";
import type { ImageUploaderButtonProps } from "./types";

export function ImageUploaderButton({
  ref,
  onImageUpload,
  onImagesUpload,
  toggled,
  onToggle,
  ...rest
}: ImageUploaderButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mergedRefs = useMergeRefs([ref, buttonRef]) as typeof buttonRef;

  const stableOnImageUpload = useEffectEvent(
    async (draftAndFile: ImageDraftStateAndFile | undefined) => {
      await onImageUpload?.(draftAndFile);
    },
  ) satisfies typeof onImageUpload;

  const stableOnImagesUpload = useEffectEvent(async (draftsAndFiles: ImageDraftStateAndFile[]) => {
    await onImagesUpload?.(draftsAndFiles);
  }) satisfies typeof onImagesUpload;

  const handleFileChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const imageDraftStatesAndFiles = processImageFiles(event.currentTarget.files);
      stableOnImageUpload(imageDraftStatesAndFiles[0]);
      stableOnImagesUpload(imageDraftStatesAndFiles);
    } finally {
      event.currentTarget.value = "";
    }
  }, []);

  const handleFormSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }, []);

  return (
    <InvisibleForm onSubmit={handleFormSubmit}>
      <InvisibleLabel>
        <InvisibleControl
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={onImagesUpload != null}
          onChange={handleFileChange}
          tabIndex={-1}
        />
        <ToggleButton
          ref={mergedRefs}
          data-component="ImageUploaderButton"
          type="button"
          toggled={toggled}
          onToggle={onToggle}
          onClick={() => inputRef?.current?.click()}
          titleOn="Upload"
          titleOff="Upload"
          icon={<IconUpload />}
          {...rest}
        />
      </InvisibleLabel>
    </InvisibleForm>
  );
}
