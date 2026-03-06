import type { PageContext } from "vike/types";

/**
 * Catch-all route: match every URL so the SPA (React Router) handles routing.
 */
export function route(_pageContext: PageContext) {
  return {};
}
