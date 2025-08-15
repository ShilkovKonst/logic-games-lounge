import { BoardProvider } from "./BoardStateContext";
import { GameProvider } from "./GameStateContext";
import { PlayerProvider } from "./PlayerStateContext";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BoardProvider>
      <PlayerProvider>
        <GameProvider>{children}</GameProvider>
      </PlayerProvider>
    </BoardProvider>
  );
}
