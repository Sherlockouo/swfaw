import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NextUIProvider } from "@nextui-org/react";

if (import.meta.env.PROD) {
  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <NextUIProvider>
      <NextThemesProvider attribute="class">
        <App />
      </NextThemesProvider>
    </NextUIProvider>
  </React.StrictMode>,
);
