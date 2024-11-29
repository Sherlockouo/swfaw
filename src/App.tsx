import "./App.css";

import Main from "@/window/Main";
import Config from "@/window/Config";
import { BrowserRouter } from "react-router-dom";
import { getCurrentWebview } from "@tauri-apps/api/webview";

const WindowMap = {
  main: <Main />,
  config: <Config />,
};
const App: React.FC = () => {
  return (
    <div className="h-screen w-screen">
      <BrowserRouter>
        {WindowMap[getCurrentWebview().label as keyof typeof WindowMap]}
      </BrowserRouter>
    </div>
  );
};

export default App;
