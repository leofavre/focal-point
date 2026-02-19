import type { SVGProps } from "react";

export const IconReference = (props: SVGProps<SVGSVGElement>) => {
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
        d="M 11 2 v 3"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeMiterlimit={10}
      />
      <path
        d="M 2 11 h 3"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeMiterlimit={10}
      />
      <path
        d="M 11 20 v -3"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeMiterlimit={10}
      />
      <path
        d="M 20 11 h -3"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeMiterlimit={10}
      />
      <path
        d="M 11 10 v 2"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeMiterlimit={10}
      />
      <path
        d="M 11 16.75 L 5.25 11 L 11 5.25 L 16.75 11 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeMiterlimit={10}
      />
    </svg>
  );
};
