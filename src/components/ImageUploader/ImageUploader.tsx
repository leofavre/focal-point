import type { ImageUploaderProps } from "./types";

export function ImageUploader({ ref, onFormSubmit, onImageChange, className }: ImageUploaderProps) {
  return (
    <div className={className}>
      <form onSubmit={onFormSubmit} noValidate>
        <div className="image-uploader">
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
        </div>
      </form>
    </div>
  );
}
