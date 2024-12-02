import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NextUIProvider } from "@nextui-org/react";
import { initializeStore } from "@/store/persist-store";
import { Toaster } from "sonner";

if (import.meta.env.PROD) {
  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });
}
initializeStore().then(() => {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <NextUIProvider>
        <NextThemesProvider attribute="class">
          <App />
          <Toaster />
        </NextThemesProvider>
      </NextUIProvider>
    </React.StrictMode>,
  );
});
