import type { SVGProps } from "react";

export const IconUpload = (props: SVGProps<SVGSVGElement>) => {
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
        d="M 4.88 10.12 L 11 4 L 17.12 10.12"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeMiterlimit={10}
      />
      <path
        d="M 11 4 v 11"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeMiterlimit={10}
      />
      <path
        d="M 5 18 h 12"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeMiterlimit={10}
      />
    </svg>
  );
};
