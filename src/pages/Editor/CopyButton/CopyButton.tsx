import { ToggleButton } from "../../../components/ToggleButton/ToggleButton";
import { IconCopy } from "../../../icons/IconCopy";
import { Button } from "./CopyButton.styled";
import type { CopyButtonProps } from "./types";

export const CopyButton = ({ copied, onCopy }: CopyButtonProps) => (
  <Button type="button" toggleable={false} toggled={copied} onClick={onCopy}>
    <IconCopy />
    <ToggleButton.ButtonText>{copied ? "Copied!" : "Copy"}</ToggleButton.ButtonText>
  </Button>
);
