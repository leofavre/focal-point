import { useMemo } from "react";
import { toLogPosition } from "../helpers/toLogPosition";
import type { AspectRatio } from "../types";

/** Preset aspect ratios (name → value) from portrait 9:16 to landscape 4:1. */
const ASPECT_RATIO_MAP: Record<string, number> = {
  "9:16": 9 / 16,
  "4:5": 4 / 5,
  "5:7": 5 / 7,
  "3:4": 3 / 4,
  "3:5": 3 / 5,
  "2:3": 2 / 3,
  "1:1": 1 / 1,
  "3:2": 3 / 2,
  "5:3": 5 / 3,
  "4:3": 4 / 3,
  "7:5": 7 / 5,
  "5:4": 5 / 4,
  "16:9": 16 / 9,
  "4:1": 4 / 1,
};

const ASPECT_RATIO_LIST: AspectRatio[] = Object.entries(ASPECT_RATIO_MAP)
  .map(([name, value]) => ({
    name,
    value,
    position: toLogPosition(value, ASPECT_RATIO_MAP["9:16"], ASPECT_RATIO_MAP["4:1"]),
  }))
  .sort((a, b) => a.value - b.value);

/** Preset ratios within this distance of the original are omitted to avoid duplicate ticks. */
const POSITION_REPLACEMENT_THRESHOLD = 1 / 50;

/**
 * Returns a sorted list of aspect ratio options for the slider.
 *
 * When `originalAspectRatioValue` is provided (e.g. the image’s natural aspect ratio),
 * an "original" entry is added and any preset within {@link POSITION_REPLACEMENT_THRESHOLD}
 * of that value is removed so the slider doesn’t show duplicate ticks.
 *
 * @returns Array of {@link AspectRatio} sorted by value (portrait to landscape)
 */
export function useAspectRatioList(originalAspectRatioValue?: number) {
  return useMemo(() => {
    const minValue = ASPECT_RATIO_LIST.at(0)?.value;
    const maxValue = ASPECT_RATIO_LIST.at(-1)?.value;

    if (originalAspectRatioValue == null || minValue == null || maxValue == null) {
      return ASPECT_RATIO_LIST;
    }

    const original: AspectRatio = {
      name: "original",
      value: originalAspectRatioValue,
      position: toLogPosition(originalAspectRatioValue, minValue, maxValue),
    };

    return [...ASPECT_RATIO_LIST, original]
      .sort((a, b) => a.value - b.value)
      .filter(
        ({ name, value }) =>
          (name === original.name && value === original.value) ||
          value < original.value - POSITION_REPLACEMENT_THRESHOLD ||
          value > original.value + POSITION_REPLACEMENT_THRESHOLD,
      );
  }, [originalAspectRatioValue]);
}
