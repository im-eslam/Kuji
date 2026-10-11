import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { getCatalog } from "./app/lib/catalog";
import { warmCategoryImages } from "./app/lib/images";
import "./index.css";

warmCategoryImages([
  ...new Set(getCatalog().signatureIds.map((id) => getCatalog().itemById[id].categoryId)),
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
