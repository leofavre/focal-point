import { type ChangeEvent, type FormEvent, useCallback, useEffectEvent } from "react";
import type { ImageDraftState } from "../../types";
import { Control, ImageUploaderForm } from "./ImageUploader.styled";
import type { ImageDraftStateAndFile, ImageUploaderProps } from "./types";

export function ImageUploader({ ref, onImageUpload, ...rest }: ImageUploaderProps) {
  const stableOnImageUpload = useEffectEvent((event: ImageDraftStateAndFile[]) => {
    onImageUpload?.(event);
  }) satisfies typeof onImageUpload;

  const handleFileChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    stableOnImageUpload(
      Array.from(event.currentTarget.files ?? [])
        .filter((file) => file.type.startsWith("image/"))
        .map((file) => {
          const imageDraftState: ImageDraftState = {
            name: file.name,
            type: file.type,
            createdAt: Date.now(),
            breakpoints: [],
          };

          return { imageDraftState, file };
        }),
    );
  }, []);

  const handleFormSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }, []);

  return (
    <ImageUploaderForm onSubmit={handleFormSubmit} noValidate {...rest}>
      <Control
        ref={ref}
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        required
      />
    </ImageUploaderForm>
  );
}
