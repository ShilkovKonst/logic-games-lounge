import { GAMES } from "@/lib/constants";
import MenuButton from "./MenuButton";
import DividerBlock from "./DividerBlock";
import { Dispatch, SetStateAction, useCallback } from "react";
import { View } from "./LandingBlock";
import { useGlobalState } from "@/context/GlobalStateContext";
import { useRouter } from "next/navigation";

type GameProps = {
  setSelectedGame: Dispatch<SetStateAction<string>>;
  setView: Dispatch<SetStateAction<View>>;
};

const GameBlock = ({ setSelectedGame, setView }: GameProps) => {
  const { t, locale } = useGlobalState();
  const router = useRouter();

  const handleGameClick = (game: string) => {
    setSelectedGame(game);
    setView("mode-select");
  };

  const handleJoinClick = () => router.push(`/${locale}/lobby?guest`);

  return (
    <div className="flex flex-col gap-3 w-48">
      {GAMES.map((game) => (
        <MenuButton
          key={game}
          title={t(`landing.${game}`)}
          onClick={() => handleGameClick(game)}
        />
      ))}
      <DividerBlock text={t("landing.or")} />
      <MenuButton title={t("landing.joinOnline")} onClick={handleJoinClick} />
    </div>
  );
};

export default GameBlock;
