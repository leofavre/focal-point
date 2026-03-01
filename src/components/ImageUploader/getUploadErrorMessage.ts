import { ErrorCode } from "react-dropzone";

/** Custom error when single-image mode is enforced but user selected multiple files. */
export const SINGLE_IMAGE_REQUIRED = "single-image-required" as const;

export type UploadErrorCode = ErrorCode | typeof SINGLE_IMAGE_REQUIRED;

/**
 * Maps react-dropzone rejection codes to user-facing messages.
 * Used when showing toast.error for invalid or rejected uploads.
 */
export function getUploadErrorMessage(reason: UploadErrorCode): string {
  switch (reason) {
    case ErrorCode.FileInvalidType:
      return "Only image files are allowed";
    case ErrorCode.FileTooLarge:
      return "File is too large";
    case ErrorCode.FileTooSmall:
      return "File is too small";
    case ErrorCode.TooManyFiles:
      return "Too many files";
    case SINGLE_IMAGE_REQUIRED:
      return "Only a single image is allowed";
    default:
      return "File could not be uploaded";
  }
}
