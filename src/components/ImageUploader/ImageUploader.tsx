import styled from "@emotion/styled";
import type { ImageUploaderProps } from "./types";

const ImageUploaderForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
`;

const Control = styled.input`
  display: block;
  font-size: 0.875rem;
  color: #6b7280;

  &::file-selector-button {
    margin-right: 1rem;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    border: 0;
    font-size: 0.875rem;
    font-weight: 600;
    background-color: #eff6ff;
    color: #1d4ed8;
    cursor: pointer;

    &:hover {
      background-color: #dbeafe;
    }
  }
`;

const HelpText = styled.p`
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280;
`;

export function ImageUploader({ ref, onFormSubmit, onImageChange, ...rest }: ImageUploaderProps) {
  return (
    <ImageUploaderForm onSubmit={onFormSubmit} noValidate {...rest}>
      <Label htmlFor="image-upload">Upload Image</Label>
      <Control
        ref={ref}
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={onImageChange}
        required
      />
      <HelpText>Only image files are allowed (e.g., PNG, JPEG, GIF, WebP)</HelpText>
    </ImageUploaderForm>
  );
}
