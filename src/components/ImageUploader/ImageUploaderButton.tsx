import {
  type ChangeEvent,
  type FormEvent,
  useCallback,
  useEffectEvent,
  useRef,
  useState,
} from "react";
import { IconUpload } from "../../icons/IconUpload";
import type { ImageDraftStateAndFile } from "../../types";
import { ToggleButton } from "../ToggleButton/ToggleButton";
import { processImageFiles } from "./helpers/processImageFiles";
import { InvisibleControl, InvisibleForm, InvisibleLabel } from "./ImageUploader.styled";
import type { ImageUploaderButtonProps } from "./types";

export function ImageUploaderButton({
  onImageUpload,
  onImagesUpload,
  ref,
  ...rest
}: ImageUploaderButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);

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
          ref={ref}
          data-component="ImageUploaderButton"
          type="button"
          toggled={isUploading}
          onToggle={(toggled) => setIsUploading(!toggled)}
          onClick={() => inputRef.current?.click()}
          titleOn="Upload"
          titleOff="Upload"
          icon={<IconUpload />}
          {...rest}
        />
      </InvisibleLabel>
    </InvisibleForm>
  );
}
