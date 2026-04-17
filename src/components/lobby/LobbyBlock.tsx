"use client";
import { useGlobalState } from "@/context/GlobalStateContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useP2PContext } from "@/context/P2PContext";
import { useEffect } from "react";
import LocaleBlock from "../locale/LocaleBlock";
import MenuButton from "../landing/MenuButton";
import HostLobbyBlock from "./HostLobbyBlock";
import GuestLobbyBlock from "./GuestLobbyBlock";

const LobbyBlock = () => {
  const { t, locale } = useGlobalState();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isHost = searchParams.has("host");
  const isGuest = searchParams.has("guest");
  const joinCode = searchParams.get("join");
  const selectedGame = searchParams.get("game");

  const { status, gameToPlay, enable, startGame } = useP2PContext();

  useEffect(() => {
    enable();
  }, [enable]);

  useEffect(() => {
    if (status === "connected" && selectedGame && !gameToPlay)
      startGame(selectedGame);
  }, [status, selectedGame, gameToPlay, startGame]);

  useEffect(() => {
    if (gameToPlay && status === "connected") {
      router.push(`/${locale}/${gameToPlay}/online`);
    }
  }, [gameToPlay, status, router, locale]);

  const handleBack = () => router.push(`/${locale}/`);

  return (
    <main className="font-sans flex flex-col items-center justify-center min-h-screen gap-8 px-4">
      <div className="absolute top-2 right-2">
        <LocaleBlock isMenuOpen={false} />
      </div>

      <div className="text-center">
        <h1 className="text-4xl font-bold text-amber-950 tracking-tight">
          {t("lobby.title")}
        </h1>
      </div>

      {isHost && (
        <HostLobbyBlock selectedGame={selectedGame} handleBack={handleBack} />
      )}

      {isGuest && (
        <GuestLobbyBlock joinCode={joinCode} handleBack={handleBack} />
      )}

      {!isHost && !isGuest && (
        <div className="flex flex-col items-center gap-4 text-center max-w-xs">
          <p className="text-sm font-semibold text-amber-800">
            {t("lobby.invalidAccess")}
          </p>
          <MenuButton title={`← ${t("nav.home")}`} onClick={handleBack} />
        </div>
      )}
    </main>
  );
};

export default LobbyBlock;
