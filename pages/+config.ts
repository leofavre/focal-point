import type { Config } from "vike/types";
import vikeReact from "vike-react/config";

export default {
  extends: [vikeReact],
  title: "Focal Point Editor",
  prerender: true,
} satisfies Config;
