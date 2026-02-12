import styled from "@emotion/styled";
import type { PropsWithChildren } from "react";
import { useEffect, useRef } from "react";
import { AspectRatioSlider } from "../components/AspectRatioSlider/AspectRatioSlider";
import { useAspectRatioList } from "../components/AspectRatioSlider/hooks/useAspectRatioList";
import { CodeSnippet } from "../components/CodeSnippet/CodeSnippet";
import { Dialog } from "../components/Dialog/Dialog";
import { FocalPointEditor } from "../components/FocalPointEditor/FocalPointEditor";
import { FullScreenDropZone } from "../components/ImageUploader/FullScreenDropZone";
import { ImageUploaderButton } from "../components/ImageUploader/ImageUploaderButton";
import { ToggleButton } from "../components/ToggleButton/ToggleButton";
import { IconCode } from "../icons/IconCode";
import { IconMask } from "../icons/IconMask";
import { IconReference } from "../icons/IconReference";
import type { ObjectPositionString } from "../types";
import { useEditorContext } from "../contexts/EditorContext";
import { EditorGrid } from "./Editor.styled";
import { createKeyboardShortcutHandler } from "./helpers/createKeyboardShortcutHandler";
import { Landing } from "./Landing/Landing";

const DEFAULT_OBJECT_POSITION: ObjectPositionString = "50% 50%";
const DEFAULT_CODE_SNIPPET_LANGUAGE = "html" as const;

const noop = () => {};

/**
 * @todo
 *
 * ### MELHORIZE™ UI.
 *
 * - Verify accessibility.
 * - Review aria labels.
 * - Think about animations and transitions.
 * - Improve Landing page.
 * - Improve Full Screen Drop Zone.
 * - Improve loading state.
 * - Improve Code snippet.
 * - Improve toasters.
 * - Fix weird shadow in buttons.
 * - Mobile: fix text overflowing buttons on mobile Chrome. Maybe related to container queries?
 * - Mobile: fix mobile functionality again. Review scroll event being activated sometimes.
 * - Mobile: remove glow from iOS when clicking on buttons.
 * - Mobile: always use &:active instead of &:hover for touch devices.
*
* ### Basic functionality
*
*  - Make the app use the same routing for every persistence mode.
*  - Split Editor.tsx in two files and take advantage of BrowserRouter's routes '/' and '/:imageId'.
*  - Then next step will be code splitting.
 * - Handle errors with toaster.
 * - Remove all deprecated and dead code.
 *
 * ### DevOps
 *
 * - Control cache invalidation, given it's a PWA.
 * - Add Storybook tests (to see how it works?).
 *
 * ### Advanced functionality
 *
 * - Support external image sources.
 * - Breakpoints with container queries.
 * - Multiple images with "file system".
 * - Maybe make a browser extension?
 * - Maybe make a React component?
 * - Maybe make a native custom element?
 */
export default function Editor() {
  const uploaderButtonRef = useRef<HTMLButtonElement>(null);

  const {
    image,
    imageCount,
    aspectRatio,
    setAspectRatio,
    showFocalPoint,
    setShowFocalPoint,
    showImageOverflow,
    setShowImageOverflow,
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
    bottomBarPositioning,
    handleImageUpload,
    handleImageError,
    handleObjectPositionChange,
  } = useEditorContext();

  const aspectRatioList = useAspectRatioList(image?.naturalAspectRatio);

  /**
   * Handles all keyboard shortcuts:
   * - 'u' opens the file input to upload a new image.
   * - 'a' or 'f' toggles the focal point.
   * - 's' or 'o' toggles the image overflow.
   * - 'd' or 'c' toggles the code snippet.
   *
   * The shortcuts are case insensitive and are not triggered
   * when modified with meta keys like Control or Command.
   */
  useEffect(() => {
    const handleKeyDown = createKeyboardShortcutHandler({
      u: () => {
        uploaderButtonRef.current?.click();
      },
      a: () => {
        setShowFocalPoint((prev) => !prev);
      },
      f: () => {
        setShowFocalPoint((prev) => !prev);
      },
      s: () => {
        setShowImageOverflow((prev) => !prev);
      },
      o: () => {
        setShowImageOverflow((prev) => !prev);
      },
      d: () => {
        setShowCodeSnippet((prev) => !prev);
      },
      c: () => {
        setShowCodeSnippet((prev) => !prev);
      },
    });

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setShowCodeSnippet, setShowFocalPoint, setShowImageOverflow]);

  return (
    <>
      <FullScreenDropZone onImageUpload={handleImageUpload} onImageUploadError={noop} />
      <EditorGrid>
        {isLoading ? (
          <Message>Loading...</Message>
        ) : pageState === "landing" ? (
          <Landing
            uploaderButtonRef={uploaderButtonRef}
            onImageUpload={handleImageUpload}
            onImageUploadError={noop}
          />
        ) : pageState === "editing" && image != null && aspectRatio != null ? (
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
        ) : pageState === "pageNotFound" ? (
          <Message>Page not found...</Message>
        ) : pageState === "imageNotFound" ? (
          <Message>
            {isEditingSingleImage && imageCount === 0
              ? "Start by uploading an image..."
              : "Image not found..."}
          </Message>
        ) : (
          <Message>Critical error...</Message>
        )}
        <ToggleButton
          type="button"
          data-component="FocalPointButton"
          toggled={showFocalPoint ?? false}
          onToggle={(toggled) => setShowFocalPoint(!toggled)}
          titleOn="Focal point"
          titleOff="Focal point"
          icon={<IconReference />}
          css={bottomBarPositioning}
        />
        <ToggleButton
          type="button"
          data-component="ImageOverflowButton"
          toggled={showImageOverflow ?? false}
          onToggle={(toggled) => setShowImageOverflow(!toggled)}
          titleOn="Overflow"
          titleOff="Overflow"
          icon={<IconMask />}
          css={bottomBarPositioning}
        />
        <ToggleButton
          type="button"
          data-component="CodeSnippetButton"
          toggled={showCodeSnippet ?? false}
          onToggle={(toggled) => setShowCodeSnippet(!toggled)}
          titleOn="Code"
          titleOff="Code"
          icon={<IconCode />}
          css={bottomBarPositioning}
        />
        <ImageUploaderButton
          ref={uploaderButtonRef}
          onImageUpload={handleImageUpload}
          onImageUploadError={noop}
          css={bottomBarPositioning}
        />
        <AspectRatioSlider
          aspectRatio={aspectRatio}
          aspectRatioList={aspectRatioList}
          onAspectRatioChange={setAspectRatio}
          css={bottomBarPositioning}
        />
      </EditorGrid>
    </>
  );
}

const MessageStyled = styled.h3`
  grid-column: 1 / -1;
  grid-row: 1 / -2;
  margin: auto;
`;

function Message({ children, ...rest }: PropsWithChildren) {
  return <MessageStyled {...rest}>{children}</MessageStyled>;
}
