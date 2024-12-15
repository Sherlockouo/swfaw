import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Switch,
  Tab,
  Tabs,
} from "@nextui-org/react";
import { cx } from "@emotion/css";

import { enable, isEnabled, disable } from "@tauri-apps/plugin-autostart";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CheckUpdate from "./update";
const Settings: React.FC = () => {
  const [autoStart, setAutoStart] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    isEnabled().then((isEnabled) => {
      setAutoStart(isEnabled);
    });
  }, []);
  const handleAutoStart = async () => {
    if (autoStart) {
      await disable();
    } else {
      await enable();
    }
    setAutoStart(!autoStart);
  };
  const tabsConfig = [
    {
      key: "general",
      title: "General",
      content: (
        <div className="w-full flex flex-col gap-2 h-full">
          <div className="flex flex-col">
            <div className="">Auto Start</div>
            <Checkbox isSelected={autoStart} onChange={handleAutoStart}>
              Auto Start
            </Checkbox>
          </div>
          <div className="flex flex-col">
            <div className="font-mono">UI</div>
            <Switch defaultSelected aria-label="theme">
              {" "}
              Theme
            </Switch>
          </div>
          <div className="flex flex-col">
            <div className="font-mono">Updates</div>
            <Switch defaultSelected aria-label="Automatic updates">
              {" "}
              Automatic updates
            </Switch>
          </div>

          <div className="flex flex-col">
            <CheckUpdate />
          </div>
        </div>
      ),
    },
    {
      key: "notification",
      title: "Notification", // TODO: i18n
      content: (
        <div className="w-full">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </div>
      ),
    },
    {
      key: "about",
      title: "About",
      content: (
        <div className="w-full">
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
          officia deserunt mollit anim id est laborum.
        </div>
      ),
    },
  ];
  return (
    <div className={cx("flex flex-col items-center w-full h-full")}>
      <div className="flex justify-between gap-2 items-center mb-4 w-full">
        <div className="text-3xl font-bold ">Settings</div>
        <div>
          <Button
            size="sm"
            isIconOnly
            onClick={() => {
              navigate("/");
            }}
          >
            <X />
          </Button>
        </div>
      </div>
      <div className="w-full h-full">
        <Tabs aria-label="Options" isVertical>
          {tabsConfig.map((tab) => (
            <Tab key={tab.key} title={tab.title} className="w-full">
              <Card className="w-full">
                <CardBody className="w-full">{tab.content}</CardBody>
              </Card>
            </Tab>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
