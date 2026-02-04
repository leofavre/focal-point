import { SmallButton } from "../SmallButton";
import type { ToggleButtonProps } from "./types";

export function ToggleButton({
  toggled,
  onToggle,
  titleOn,
  titleOff,
  icon,
  ref,
  ...rest
}: ToggleButtonProps) {
  return (
    <SmallButton
      ref={ref}
      as="button"
      type="button"
      title={toggled ? titleOn : titleOff}
      aria-pressed={toggled}
      onClick={onToggle}
      {...rest}
    >
      {icon}
    </SmallButton>
  );
}
