import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppContext } from "./AppContext";
import { ToasterInPopover } from "./components/ToasterInPopover/ToasterInPopover";
import Layout from "./pages/Layout";
import { PageNotFound } from "./pages/PageNotFound";

const Editor = lazy(() => import("./pages/Editor/Editor").then((m) => ({ default: m.Editor })));

export default function App() {
  return (
    <BrowserRouter>
      <ToasterInPopover />
      <AppContext>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Editor />} />
            <Route path="image/:imageId" element={<Editor />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </AppContext>
    </BrowserRouter>
  );
}
