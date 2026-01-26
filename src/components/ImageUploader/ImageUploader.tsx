import type { ImageUploaderProps } from "./types";

export function ImageUploader({ ref, onFormSubmit, onImageChange }: ImageUploaderProps) {
  return (
    <div className="image-uploader">
      <form onSubmit={onFormSubmit} noValidate>
        <label htmlFor="image-upload" className="label">
          Upload Image
        </label>
        <input
          ref={ref}
          className="control"
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={onImageChange}
          required
        />
        <p className="help-text">Only image files are allowed (e.g., PNG, JPEG, GIF, WebP)</p>
      </form>
    </div>
  );
}
