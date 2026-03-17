"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useP2PContext } from "@/context/P2PContext";
import { useGlobalState } from "@/context/GlobalStateContext";
import Chess from "@/components/chess/Chess";
import { populateBoard } from "@/lib/chess-engine/core/utils/populateBoard";
import { PlayerState } from "@/lib/chess-engine/core/types";

export default function ChessOnlinePage() {
  const { t } = useGlobalState();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const {
    status,
    playerColor,
    sendMove,
    registerGameHandler,
    opponentLeft,
    clearOpponentLeft,
  } = useP2PContext();

  const [hasConnected, setHasConnected] = useState(false);

  // Track first successful connection
  useEffect(() => {
    if (status === "connected") setHasConnected(true);
  }, [status]);

  // Redirect to lobby if arrived here without a connection (direct navigation)
  useEffect(() => {
    if (status !== "connected" && !hasConnected) {
      router.replace(`/${locale}/lobby`);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const disconnectMessage = opponentLeft
    ? t(`chess.online.disconnected.${opponentLeft}`)
    : hasConnected && status !== "connected"
    ? t("chess.online.disconnected.lost")
    : null;

  const handleBackToMenu = () => {
    clearOpponentLeft();
    router.push(`/${locale}`);
  };

  if (status !== "connected" && !playerColor) return null;

  const playerState: PlayerState = {
    type: playerColor === "white" ? "host" : "guest",
    color: playerColor ?? "white",
    status: { check: "NORMAL", draw: "none" },
  };

  return (
    <main className="font-sans flex items-center justify-center min-h-screen">
      {disconnectMessage && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-amber-50 bg-opacity-95 rounded-3xl p-8 text-center shadow-2xl max-w-md w-11/12 mx-4">
            <h3 className="text-xl font-semibold text-amber-900 mb-4">
              {disconnectMessage}
            </h3>
            <button
              onClick={handleBackToMenu}
              className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-amber-50 hover:text-amber-950 rounded-lg font-medium transition-colors duration-300 shadow-md cursor-pointer"
            >
              {t("chess.online.disconnected.backToMenu")}
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-col justify-center items-center">
        <Chess
          gameType="online"
          currentTurn="white"
          currentTurnNo={1}
          pieces={populateBoard("white")}
          plState={playerState}
          sendMove={sendMove}
          registerRemoteHandler={registerGameHandler}
        />
      </div>
    </main>
  );
}
