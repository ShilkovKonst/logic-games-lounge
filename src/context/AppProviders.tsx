import { GlobalProvider } from "./GlobalStateContext";
import { PlayerProvider } from "./PlayerStateContext";
import { P2PProvider } from "./P2PContext";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GlobalProvider>
      <PlayerProvider>
        <P2PProvider>{children}</P2PProvider>
      </PlayerProvider>
    </GlobalProvider>
  );
}
