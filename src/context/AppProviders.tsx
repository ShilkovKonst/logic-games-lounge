import { PlayerProvider } from "./PlayerStateContext";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PlayerProvider>{children}</PlayerProvider>;
}
