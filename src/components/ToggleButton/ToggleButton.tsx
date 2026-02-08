import { SmallButton } from "../SmallButton";
import type { ToggleButtonProps } from "./types";

export function ToggleButton({
  toggled,
  onToggle,
  titleOn,
  titleOff,
  icon,
  ref,
  type,
  ...rest
}: ToggleButtonProps) {
  const label = toggled ? titleOn : titleOff;
  return (
    <SmallButton
      ref={ref}
      as="button"
      type={type}
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
