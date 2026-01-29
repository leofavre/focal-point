import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./style.css";
import { initDB } from "react-indexed-db-hook";

const rootElement = document.getElementById("app");

const DBConfig = {
  name: "FocusPointDB",
  version: 1,
  objectStoresMeta: [
    {
      store: "ui",
      storeConfig: {
        keyPath: "id",
        autoIncrement: true,
      },
      storeSchema: [
        {
          name: "value",
          keypath: "value",
          options: { unique: false },
        },
      ],
    },
  ],
};

initDB(DBConfig);

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
