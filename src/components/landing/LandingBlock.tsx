"use client";
import { useGlobalState } from "@/context/GlobalStateContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import GameBlock from "./GameBlock";
import ModeBlock from "./ModeBlock";

export type View = "game-select" | "mode-select";

const LandingBlock = () => {
  const { t, locale } = useGlobalState();
  const router = useRouter();
  const [view, setView] = useState<View>("game-select");
  const [selectedGame, setSelectedGame] = useState("");
  const subtitle: Record<View, string> = {
    "game-select": t("landing.chooseGame"),
    "mode-select": t("landing.chooseMode"),
  };

  return (
    <main className="font-sans flex flex-col items-center justify-center min-h-screen gap-4 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-amber-950 tracking-tight">
          Logic Games Lounge
        </h1>
        <p className="text-amber-900 mt-2 font-semibold text-sm">
          {subtitle[view]}
        </p>
      </div>

      {view === "game-select" && (
        <GameBlock setSelectedGame={setSelectedGame} setView={setView} />
      )}

      {view === "mode-select" && (
        <ModeBlock
          onHotseatClick={() => router.push(`/${locale}/${selectedGame}`)}
          onOnlineClick={() =>
            router.push(`/${locale}/lobby?host&game=${selectedGame}`)
          }
          onBackClick={() => setView("game-select")}
        />
      )}
    </main>
  );
};

export default LandingBlock;
