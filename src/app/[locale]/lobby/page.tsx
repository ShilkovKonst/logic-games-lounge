import { Suspense } from "react";
import LobbyBlock from "@/components/lobby/LobbyBlock";

export default function LobbyPage() {
  return (
    <Suspense>
      <LobbyBlock />
    </Suspense>
  );
}
