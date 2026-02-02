import type { RefObject } from "react";
import type { ImageRecord } from "../../../types";

export type LandingImageCellProportion = "square" | "horizontal" | "vertical";

export type LandingImageCellProps = {
  ref?: RefObject<HTMLImageElement | null>;
  imageRecord: ImageRecord;
  proportion?: LandingImageCellProportion;
};
