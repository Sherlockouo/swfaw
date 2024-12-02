import { Button } from "@nextui-org/react";
import { listen } from "@tauri-apps/api/event";
import { useState, useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Maximize2, Minimize2, Minus, X } from "lucide-react";

export default function WindowControl() {
  const [isMax, setIsMax] = useState(false);

  useEffect(() => {
    listen("tauri://resize", async () => {
      if (await getCurrentWindow().isMaximized()) {
        setIsMax(true);
      } else {
        setIsMax(false);
      }
    });
  }, []);

  return (
    <div
      data-tauri-drag-region="true"
      className="fixed top-[5px] left-[5px] right-[5px] h-[30px]"
    >
      <Button
        isIconOnly
        variant="light"
        className="w-[35px] h-[35px] rounded-none"
        onPress={async () => await getCurrentWindow().minimize()}
      >
        <X className="text-[16px]" />
      </Button>
      <Button
        isIconOnly
        variant="light"
        className={`w-[35px] h-[35px] rounded-none close-button `}
        onPress={async () => await getCurrentWindow().close()}
      >
        <Minus className="text-[16px]" />
      </Button>
      <Button
        isIconOnly
        variant="light"
        className="w-[35px] h-[35px] rounded-none"
        onPress={async () => {
          if (isMax) {
            await getCurrentWindow().unmaximize();
          } else {
            await getCurrentWindow().maximize();
          }
        }}
      >
        {isMax ? (
          <Minimize2 className="text-[16px]" />
        ) : (
          <Maximize2 className="text-[16px]" />
        )}
      </Button>
    </div>
  );
}
