import styled from "@emotion/styled";
import type { PropsWithChildren } from "react";
import { CodeSnippet } from "../components/CodeSnippet/CodeSnippet";
import { Dialog } from "../components/Dialog/Dialog";
import { FocalPointEditor } from "../components/FocalPointEditor/FocalPointEditor";
import { useEditorContext } from "../contexts/EditorContext";
import type { ObjectPositionString } from "../types";
import { Landing } from "./Landing/Landing";

const DEFAULT_OBJECT_POSITION: ObjectPositionString = "50% 50%";
const DEFAULT_CODE_SNIPPET_LANGUAGE = "html" as const;

const noop = () => {};

const MessageStyled = styled.h3`
  grid-column: 1 / -1;
  grid-row: 1 / -2;
  margin: auto;
`;

function Message({ children, ...rest }: PropsWithChildren) {
  return <MessageStyled {...rest}>{children}</MessageStyled>;
}

/**
 * Route-specific content rendered inside the Editor layout. Shows Landing, editing view,
 * or appropriate messages based on pageState and loading state.
 */
export function EditorContent() {
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
    isLoading,
    isEditingSingleImage,
    handleImageUpload,
    handleImageError,
    handleObjectPositionChange,
    uploaderButtonRef,
  } = useEditorContext();

  if (isLoading) {
    return <Message>Loading...</Message>;
  }

  if (pageState === "landing") {
    return (
      <Landing
        uploaderButtonRef={uploaderButtonRef}
        onImageUpload={handleImageUpload}
        onImageUploadError={noop}
      />
    );
  }

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
        <Dialog transparent open={showCodeSnippet} onOpenChange={setShowCodeSnippet}>
          <CodeSnippet
            src={image.name}
            objectPosition={currentObjectPosition ?? DEFAULT_OBJECT_POSITION}
            language={codeSnippetLanguage ?? DEFAULT_CODE_SNIPPET_LANGUAGE}
            onLanguageChange={setCodeSnippetLanguage}
            copied={codeSnippetCopied}
            onCopiedChange={setCodeSnippetCopied}
          />
        </Dialog>
      </>
    );
  }

  if (pageState === "pageNotFound") {
    return <Message>Page not found...</Message>;
  }

  if (pageState === "imageNotFound") {
    return (
      <Message>
        {isEditingSingleImage && imageCount === 0
          ? "Start by uploading an image..."
          : "Image not found..."}
      </Message>
    );
  }

  return <Message>Critical error...</Message>;
}
