import { Suspense, useCallback } from "react";
import toast from "react-hot-toast";
import { Outlet } from "react-router-dom";
import { useEditorContext } from "../AppContext";
import { AspectRatioSlider } from "../components/AspectRatioSlider/AspectRatioSlider";
import { FullScreenDropZone } from "../components/ImageUploader/FullScreenDropZone";
import type { UploadErrorCode } from "../components/ImageUploader/getUploadErrorMessage";
import { getUploadErrorMessage } from "../components/ImageUploader/getUploadErrorMessage";
import { ImageUploaderButton } from "../components/ImageUploader/ImageUploaderButton";
import { ToggleButton } from "../components/ToggleButton/ToggleButton";
import type { Err } from "../helpers/errorHandling";
import { parseBooleanAttr } from "../helpers/parseBooleanAttr";
import { IconCode } from "../icons/IconCode";
import { IconMask } from "../icons/IconMask";
import { IconReference } from "../icons/IconReference";
import { LayoutGrid, LayoutMessage } from "./Layout.styled";

/**
 * @todo
 *
 * ### MELHORIZE™ UI.
 *
 * - Add loading state icon.
 * - Add link to home page.
 * - Add transition when landing content is removed.
 * - Apply accessibility best practices.
 *
 * ### Basic functionality
 *
 * - Fix CI bug in which Auto-merge is triggered twice.
 *
 * ### Advanced functionality
 *
 * - Maybe SSR?
 * - Support external image sources.
 * - Multiple images with "file system".
 * - Maybe make a browser extension?
 * - Maybe make a React component?
 * - Maybe make a native custom element?
 */
export default function Layout() {
  const {
    image,
    aspectRatio,
    setAspectRatio,
    showFocalPoint,
    setShowFocalPoint,
    showImageOverflow,
    setShowImageOverflow,
    showCodeSnippet,
    setShowCodeSnippet,
    showBottomBar,
    handleImageUpload,
    uploaderButtonRef,
    isLoading,
  } = useEditorContext();

  const handleImageUploadError = useCallback((error: Err<UploadErrorCode>) => {
    toast.error(getUploadErrorMessage(error));
  }, []);

  const handleDragStart = useCallback(() => {
    setShowCodeSnippet(false);
  }, [setShowCodeSnippet]);

  return (
    <>
      <FullScreenDropZone
        onImageUpload={handleImageUpload}
        onImageUploadError={handleImageUploadError}
        onDragStart={handleDragStart}
      />
      <LayoutGrid data-has-bottom-bar={parseBooleanAttr(showBottomBar)}>
        <Suspense fallback={<LayoutMessage key="loading">Loading...</LayoutMessage>}>
          {isLoading ? <LayoutMessage key="loading">Loading...</LayoutMessage> : <Outlet />}
        </Suspense>
        <ToggleButton
          type="button"
          data-component="FocalPointButton"
          toggleable
          toggled={showFocalPoint ?? false}
          onToggle={(toggled) => setShowFocalPoint(!toggled)}
        >
          <IconReference />
          <ToggleButton.ButtonText>Focal point</ToggleButton.ButtonText>
        </ToggleButton>
        <ToggleButton
          type="button"
          data-component="ImageOverflowButton"
          toggleable
          toggled={showImageOverflow ?? false}
          onToggle={(toggled) => setShowImageOverflow(!toggled)}
        >
          <IconMask />
          <ToggleButton.ButtonText>Overflow</ToggleButton.ButtonText>
        </ToggleButton>
        <AspectRatioSlider
          aspectRatio={aspectRatio}
          defaultAspectRatio={image?.naturalAspectRatio}
          onAspectRatioChange={setAspectRatio}
        />
        <ToggleButton
          type="button"
          data-component="CodeSnippetButton"
          toggleable
          toggled={showCodeSnippet ?? false}
          onToggle={(toggled) => setShowCodeSnippet(!toggled)}
        >
          <IconCode />
          <ToggleButton.ButtonText>Code</ToggleButton.ButtonText>
        </ToggleButton>
        <ImageUploaderButton
          ref={uploaderButtonRef}
          label="Image"
          onImageUpload={handleImageUpload}
          onImageUploadError={handleImageUploadError}
        />
      </LayoutGrid>
    </>
  );
}
