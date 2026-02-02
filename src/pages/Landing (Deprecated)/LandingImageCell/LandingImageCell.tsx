import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { CellImage, CellLink, CellWrapper } from "./LandingImageCell.styled";
import type { LandingImageCellProps } from "./types";

/**
 * Renders an image from an {@link ImageRecord} inside a cell.
 * Uses object-fit: cover. Cell shape is controlled by proportion (square, horizontal, or vertical).
 */
export function LandingImageCell({
  ref,
  imageRecord,
  proportion = "square",
  ...rest
}: LandingImageCellProps) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const blobUrl = URL.createObjectURL(imageRecord.file);
    setUrl(blobUrl);

    return () => {
      URL.revokeObjectURL(blobUrl);
    };
  }, [imageRecord.file]);

  if (url == null) return null;

  const objectPosition = imageRecord.breakpoints[0]?.objectPosition;

  return (
    <CellWrapper data-component="LandingImageCell" data-proportion={proportion} {...rest}>
      <CellLink to={`/${imageRecord.id}`}>
        <CellImage
          ref={ref}
          src={url}
          alt={imageRecord.name}
          style={{ "--object-position": objectPosition ?? "50% 50%" } as CSSProperties}
        />
      </CellLink>
    </CellWrapper>
  );
}
