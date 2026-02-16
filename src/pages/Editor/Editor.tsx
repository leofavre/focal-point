import styled from "@emotion/styled";
import { useEditorContext } from "../../AppContext";
import { CodeSnippet } from "../../components/CodeSnippet/CodeSnippet";
import {
  getCodeSnippet,
  getLanguageFromOptions,
} from "../../components/CodeSnippet/helpers/getCodeSnippet";
import { useCopyToClipboardWithTimeout } from "../../components/CodeSnippet/hooks/useCopyToClipboardWithTimeout";
import { Dialog } from "../../components/Dialog/Dialog";
import { DialogContent, DialogHeader } from "../../components/Dialog/Dialog.styled";
import { FocalPointEditor } from "../../components/FocalPointEditor/FocalPointEditor";
import { ToggleButton } from "../../components/ToggleButton/ToggleButton";
import { ButtonText } from "../../components/ToggleButton/ToggleButton.styled";
import type { CodeSnippetLanguage, ObjectPositionString } from "../../types";
import { LayoutMessage } from "../Layout.styled";

const DEFAULT_OBJECT_POSITION: ObjectPositionString = "50% 50%";
const DEFAULT_CODE_SNIPPET_LANGUAGE = "html" as const;

/** @todo Move to component file */
const StyledDialogHeader = styled(DialogHeader)`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  `;

type EditorCodeSnippetHeaderProps = {
  codeSnippetLanguage: CodeSnippetLanguage;
  setCodeSnippetLanguage: (language: CodeSnippetLanguage) => void;
  codeSnippetCopied: boolean;
  setCodeSnippetCopied: (copied: boolean) => void;
  imageName: string;
  objectPosition: ObjectPositionString;
};

function EditorCodeSnippetHeader({
  codeSnippetLanguage,
  setCodeSnippetLanguage,
  codeSnippetCopied,
  setCodeSnippetCopied,
  imageName,
  objectPosition,
}: EditorCodeSnippetHeaderProps) {
  const useReact = codeSnippetLanguage === "react" || codeSnippetLanguage === "react-tailwind";

  const useTailwind =
    codeSnippetLanguage === "tailwind" || codeSnippetLanguage === "react-tailwind";

  const snippetText = getCodeSnippet({
    language: codeSnippetLanguage,
    src: imageName,
    objectPosition,
  });

  const { copied, copy } = useCopyToClipboardWithTimeout(snippetText, {
    copied: codeSnippetCopied,
    onCopiedChange: setCodeSnippetCopied,
  });

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={useReact}
          onChange={(e) =>
            setCodeSnippetLanguage(getLanguageFromOptions(e.target.checked, useTailwind))
          }
        />{" "}
        React
      </label>
      <label>
        <input
          type="checkbox"
          checked={useTailwind}
          onChange={(e) =>
            setCodeSnippetLanguage(getLanguageFromOptions(useReact, e.target.checked))
          }
        />{" "}
        Tailwind
      </label>
      <ToggleButton type="button" toggleable={false} toggled={copied} onClick={copy}>
        <ButtonText>{copied ? "Copied!" : "Copy"}</ButtonText>
      </ToggleButton>
    </>
  );
}

/**
 * Content for the image route (/:imageId). Renders the editing view or error messages
 * (image not found, page not found). Loading is handled by the shared Layout.
 */
export function Editor() {
  const {
    image,
    imageCount,
    aspectRatio,
    showFocalPoint,
    showImageOverflow,
    showCodeSnippet,
    setShowCodeSnippet,
    codeSnippetLanguage,
    setCodeSnippetLanguage,
    codeSnippetCopied,
    setCodeSnippetCopied,
    currentObjectPosition,
    pageState,
    isEditingSingleImage,
    handleImageError,
    handleObjectPositionChange,
  } = useEditorContext();

  if (pageState === "editing" && image != null && aspectRatio != null) {
    return (
      <>
        <FocalPointEditor
          imageUrl={image.url}
          aspectRatio={aspectRatio}
          initialAspectRatio={image.naturalAspectRatio}
          objectPosition={currentObjectPosition ?? DEFAULT_OBJECT_POSITION}
          showFocalPoint={showFocalPoint ?? false}
          showImageOverflow={showImageOverflow ?? false}
          onObjectPositionChange={handleObjectPositionChange}
          onImageError={handleImageError}
        />
        <Dialog
          transparent
          open={showCodeSnippet}
          onOpenChange={setShowCodeSnippet}
          css={{ backgroundColor: "var(--color-body)" }}
        >
          <StyledDialogHeader>
            <EditorCodeSnippetHeader
              codeSnippetLanguage={codeSnippetLanguage ?? DEFAULT_CODE_SNIPPET_LANGUAGE}
              setCodeSnippetLanguage={setCodeSnippetLanguage}
              codeSnippetCopied={codeSnippetCopied}
              setCodeSnippetCopied={setCodeSnippetCopied}
              imageName={image.name}
              objectPosition={currentObjectPosition ?? DEFAULT_OBJECT_POSITION}
            />
          </StyledDialogHeader>
          <DialogContent>
            <CodeSnippet
              src={image.name}
              objectPosition={currentObjectPosition ?? DEFAULT_OBJECT_POSITION}
              language={codeSnippetLanguage ?? DEFAULT_CODE_SNIPPET_LANGUAGE}
            />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  if (pageState === "pageNotFound") {
    return <LayoutMessage>Page not found...</LayoutMessage>;
  }

  if (pageState === "imageNotFound") {
    return (
      <LayoutMessage>
        {isEditingSingleImage && imageCount === 0
          ? "Start by uploading an image..."
          : "Image not found..."}
      </LayoutMessage>
    );
  }

  return <LayoutMessage>Critical error...</LayoutMessage>;
}
