import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { EditorContextProvider } from "./contexts/EditorContext";
import { EditorContent } from "./pages/EditorContent";
import Editor from "./pages/Editor";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <EditorContextProvider>
        <Routes>
          <Route path="/" element={<Editor />}>
            <Route index element={<EditorContent />} />
            <Route path=":imageId" element={<EditorContent />} />
          </Route>
        </Routes>
      </EditorContextProvider>
    </BrowserRouter>
  );
}
