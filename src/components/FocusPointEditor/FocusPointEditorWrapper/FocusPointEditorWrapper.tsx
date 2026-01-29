import { detectProportionalImageHeight } from "../helpers/detectRelativeImageSize";
import {
  FocusPointEditorContainer,
  FocusPointEditorContent,
} from "./FocusPointEditorWrapper.styled";
import type { FocusPointEditorWrapperProps } from "./types";

export function FocusPointEditorWrapper({
  aspectRatio,
  cursor,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  children,
  ...rest
}: FocusPointEditorWrapperProps) {
  return (
    <FocusPointEditorContainer {...rest}>
      <FocusPointEditorContent
        css={{
          aspectRatio: aspectRatio ?? "auto",
          height: `${detectProportionalImageHeight({ aspectRatio }) ?? 0}cqmin`,
          cursor,
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {children}
      </FocusPointEditorContent>
    </FocusPointEditorContainer>
  );
}
