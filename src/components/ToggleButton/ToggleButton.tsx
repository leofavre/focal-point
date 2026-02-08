import { useCallback, useEffectEvent } from "react";
import { SmallButton } from "../SmallButton";
import type { ToggleButtonProps } from "./types";

export function ToggleButton({
  toggled,
  onToggle,
  onClick,
  titleOn,
  titleOff,
  icon,
  ref,
  type,
  ...rest
}: ToggleButtonProps) {
  const label = toggled ? titleOn : titleOff;

  const stableOnToggle = useEffectEvent((toggled: boolean) => {
    onToggle?.(toggled);
  });

  const stableOnClick = useEffectEvent(() => {
    onClick?.();
  });

  const handleClick = useCallback(() => {
    stableOnClick();
    stableOnToggle(toggled);
  }, [toggled]);

  return (
    <SmallButton
      ref={ref}
      as="button"
      type={type}
      title={label}
      aria-pressed={toggled}
      onClick={handleClick}
      {...rest}
    >
      {icon}
      <span>{label}</span>
    </SmallButton>
  );
}
