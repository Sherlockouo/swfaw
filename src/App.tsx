import "./App.css";

import Main from "@/window/Main";
import Notify from "@/window/Notify";
import { BrowserRouter } from "react-router-dom";
import { getCurrentWebview } from "@tauri-apps/api/webview";

const WindowMap = {
  main: <Main />,
  notify: <Notify />,
};

const App: React.FC = () => {
  const label = getCurrentWebview().label;
  const separatorIndex = label.indexOf("-");
  const key = separatorIndex !== -1 ? label.slice(0, separatorIndex) : label;
  return (
    <div className="h-screen w-screen">
      <BrowserRouter>{WindowMap[key as keyof typeof WindowMap]}</BrowserRouter>
    </div>
  );
};

export default App;
