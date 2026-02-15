import type { SVGProps } from "react";

export const IconCode = (props: SVGProps<SVGSVGElement>) => {
  return (
    /* biome-ignore lint/a11y/noSvgWithoutTitle: Decorative icon, hidden from screen readers */
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      viewBox="0 0 22 22"
      aria-hidden
      {...props}
    >
      <path
        d="M 6.39 16.43 L 2.5 10.97 L 7.39 5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeMiterlimit={10}
      />
      <path
        d="M 12.25 4.83 L 9.75 16.7"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeMiterlimit={10}
      />
      <path
        d="M 15.6 5.5 L 19.5 10.97 L 14.6 16.43"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeMiterlimit={10}
      />
    </svg>
  );
};
