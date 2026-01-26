import type { ChangeEvent, FormEvent, RefObject } from "react";

export type ImageUploaderProps = {
  ref?: RefObject<HTMLInputElement | null>;
  onFormSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  onImageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};
