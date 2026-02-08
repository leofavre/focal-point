import type { ReactNode, RefObject } from "react";

export type ToggleButtonProps = {
  ref?: RefObject<HTMLButtonElement | null>;
  type: "button" | "submit";
  toggled: boolean;
  onClick?: () => void;
  onToggle?: (toggled: boolean) => void;
  titleOn: string;
  titleOff: string;
  icon: ReactNode;
};
