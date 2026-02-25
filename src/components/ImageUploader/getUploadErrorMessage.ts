import { ErrorCode } from "react-dropzone";

/**
 * Maps react-dropzone rejection codes to user-facing messages.
 * Used when showing toast.error for invalid or rejected uploads.
 */
export function getUploadErrorMessage(reason: ErrorCode): string {
  switch (reason) {
    case ErrorCode.FileInvalidType:
      return "Only image files are allowed.";
    case ErrorCode.FileTooLarge:
      return "File is too large.";
    case ErrorCode.FileTooSmall:
      return "File is too small.";
    case ErrorCode.TooManyFiles:
      return "Too many files.";
    default:
      return "This file could not be uploaded.";
  }
}
