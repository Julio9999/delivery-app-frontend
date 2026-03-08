import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import "./index.css";
import { Toaster } from "@/components/ui/sonner"


const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(
  <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <Toaster />
  </React.StrictMode>,
);
