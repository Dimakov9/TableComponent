import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import TableComponent from "./TableComponent/TableComponent";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <TableComponent />
  </React.StrictMode>
);
