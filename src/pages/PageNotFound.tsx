import { LayoutMessage } from "./Layout.styled";

/**
 * Fallback route for unmatched paths (e.g. /bogus). Renders within Layout so the grid and chrome stay consistent.
 */
export function PageNotFound() {
  return <LayoutMessage>Page not found</LayoutMessage>;
}
