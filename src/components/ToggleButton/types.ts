import type { ReactNode, RefObject } from "react";

export type ToggleButtonProps = {
  ref?: RefObject<HTMLButtonElement | null>;
  type: "button" | "submit";
  toggled: boolean;
  onToggle: () => void;
  titleOn: string;
  titleOff: string;
  icon: ReactNode;
};
