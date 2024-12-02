import { Checkbox } from "@nextui-org/react";
import { cx } from "@emotion/css";

const Settings: React.FC = () => {
  return (
    <div className={cx("flex flex-col items-center")}>
      <div className="font-black text-3xl font-bold mb-4">Settings</div>
      <div>
        <Checkbox defaultSelected>Auto Start</Checkbox>
      </div>
    </div>
  );
};
export default Settings;
