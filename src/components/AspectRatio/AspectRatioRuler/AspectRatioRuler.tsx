import clsx from "clsx";
import type { AspectRatioRulerProps } from "./types";

export function AspectRatioRuler({
  aspectRatioList,
  className,
  ...rest
}: AspectRatioRulerProps) {
  const preciseMinAspectRatio = aspectRatioList.at(0)?.preciseValue ?? 1;
  const preciseMaxAspectRatio = aspectRatioList.at(-1)?.preciseValue ?? 1;

  return (
    <ul
      className={clsx(
        "relative flex items-start text-xs text-gray-500",
        className,
      )}
      {...rest}
    >
      {aspectRatioList.map(({ name, preciseValue }) => (
        <li
          key={name}
          className="w-px flex flex-col justify-center absolute"
          style={{
            left: `${((preciseValue - preciseMinAspectRatio) / (preciseMaxAspectRatio - preciseMinAspectRatio)) * 100}%`,
            writingMode: "sideways-lr",
          }}
        >
          <span className="flex flew-row flex-nowrap items-center after:content-[''] after:mb-1 after:inline-block after:w-px after:h-3 after:bg-gray-500 after:align-middle">
            {name}
          </span>
        </li>
      ))}
    </ul>
  );
}
