import { useEditorContext } from "../contexts/EditorContext";
import { Landing } from "./Landing/Landing";

const noop = () => {};

/**
 * Content for the index route (/). Renders the landing page only.
 * The shared Editor layout (toolbar, drop zone, etc.) is provided by the parent route.
 */
export function EditorLanding() {
  const { handleImageUpload, uploaderButtonRef } = useEditorContext();

  return (
    <Landing
      uploaderButtonRef={uploaderButtonRef}
      onImageUpload={handleImageUpload}
      onImageUploadError={noop}
    />
  );
}
