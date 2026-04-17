import { useGlobalState } from "@/context/GlobalStateContext";
import MenuButton from "./MenuButton";
import DividerBlock from "./DividerBlock";

type ModeProps = {
  onHotseatClick: () => void;
  onOnlineClick: () => void;
  onBackClick: () => void;
};

const ModeBlock = ({
  onHotseatClick,
  onOnlineClick,
  onBackClick,
}: ModeProps) => {
  const { t } = useGlobalState();

  return (
    <div className="flex flex-col gap-3 w-48">
      <MenuButton title={t("landing.hotseat")} onClick={onHotseatClick} />
      <MenuButton title={t("landing.online")} onClick={onOnlineClick} />
      <DividerBlock />
      <MenuButton title={`← ${t("landing.back")}`} onClick={onBackClick} />
    </div>
  );
};

export default ModeBlock;
