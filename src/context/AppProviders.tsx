import { GlobalProvider } from "./GlobalStateContext";
import { PlayerProvider } from "./PlayerStateContext";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GlobalProvider>
      <PlayerProvider>{children}</PlayerProvider>
    </GlobalProvider>
  );
}
