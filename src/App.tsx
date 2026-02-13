import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { EditorContextProvider } from "./contexts/EditorContext";
import Editor from "./pages/Editor";
import { EditorImage } from "./pages/EditorImage";
import { EditorLanding } from "./pages/EditorLanding";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <EditorContextProvider>
        <Routes>
          <Route path="/" element={<Editor />}>
            <Route index element={<EditorLanding />} />
            <Route path=":imageId" element={<EditorImage />} />
          </Route>
        </Routes>
      </EditorContextProvider>
    </BrowserRouter>
  );
}
