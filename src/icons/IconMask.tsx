import type { SVGProps } from "react";

export const IconMask = (props: SVGProps<SVGSVGElement>) => {
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
        d="M 3.35 6.5 h 9 v 9 h -9 z"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeMiterlimit={10}
      />
      <path
        d="M 18.65 9.8 v -3.3 h -3.3"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeMiterlimit={10}
      />
      <path
        d="M 18.65 12.2 v 3.3 h -3.3"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeMiterlimit={10}
      />
    </svg>
  );
};
