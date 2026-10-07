import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ITEM_BY_ID, SIGNATURE_IDS } from "./app/data/menu";
import { warmCategoryImages } from "./app/lib/images";
import { inject } from "@vercel/analytics";
import "./index.css";

inject();

warmCategoryImages([
  ...new Set(SIGNATURE_IDS.map((id) => ITEM_BY_ID[id].categoryId)),
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
