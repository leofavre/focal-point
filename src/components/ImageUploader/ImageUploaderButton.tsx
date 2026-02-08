import { useRef } from "react";
import { useMergeRefs } from "react-merge-refs";
import { IconUpload } from "../../icons/IconUpload";
import { ToggleButton } from "../ToggleButton/ToggleButton";
import { useImageUploadHandlers } from "./hooks/useImageUploadHandlers";
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

  const { handleFileChange, handleFormSubmit } = useImageUploadHandlers({
    onImageUpload,
    onImagesUpload,
  });

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
