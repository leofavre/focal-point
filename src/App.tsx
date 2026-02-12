import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { EditorContextProvider } from "./contexts/EditorContext";
import Editor from "./pages/Editor";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <EditorContextProvider>
        <Routes>
          <Route path="/" element={<Editor />} />
          <Route path="/:imageId" element={<Editor />} />
        </Routes>
      </EditorContextProvider>
    </BrowserRouter>
  );
}
