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
  const label = toggled ? titleOn : titleOff;
  return (
    <SmallButton
      ref={ref}
      as="button"
      type="button"
      title={label}
      aria-pressed={toggled}
      onClick={onToggle}
      {...rest}
    >
      {icon}
      <span>{label}</span>
    </SmallButton>
  );
}
