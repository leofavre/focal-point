import { StyledToggleButton } from "./ToggleButton.styled";
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
    <StyledToggleButton
      ref={ref}
      type="button"
      title={toggled ? titleOn : titleOff}
      aria-pressed={toggled}
      onClick={onToggle}
      {...rest}
    >
      {icon}
    </StyledToggleButton>
  );
}
