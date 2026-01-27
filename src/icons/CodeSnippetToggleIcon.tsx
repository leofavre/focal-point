export function CodeSnippetToggleIcon() {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: Decorative icon, button has title
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
      <path
        d="M8 6l-6 6 6 6M16 6l6 6-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
