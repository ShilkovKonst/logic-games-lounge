import { useGlobalState } from "@/context/GlobalStateContext";
import MenuButton from "../landing/MenuButton";
import { useP2PContext } from "@/context/P2PContext";
import { useEffect, useState } from "react";

type GuestLobbyProps = { joinCode: string | null; handleBack: () => void };

const GuestLobbyBlock = ({ joinCode, handleBack }: GuestLobbyProps) => {
  const { t } = useGlobalState();
  const { status, hostBusy, connect } = useP2PContext();

  const [input, setInput] = useState("");

  // Peer ID to connect to once PeerJS is ready (used for auto-join via link)
  const [autoJoin, setAutoJoin] = useState<string | null>(null);
  // Handle ?join=PEER_ID link — switch to guest view and queue auto-connect
  useEffect(() => {
    if (joinCode) {
      setAutoJoin(joinCode);
      setInput(joinCode);
    }
  }, []);
  // Auto-connect once PeerJS is initialised and autoJoin is set
  useEffect(() => {
    if (autoJoin && status === "waiting") {
      connect(autoJoin);
      setAutoJoin(null);
    }
  }, [autoJoin, status, connect]);

  const handleJoin = () => {
    const code = input.trim();
    if (!code) return;
    connect(code);
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <div className="flex flex-col gap-3 p-4 border-2 border-amber-950 rounded-2xl bg-amber-50">
        <p className="text-sm font-semibold text-amber-800">
          {t("lobby.joinGame")}
        </p>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            placeholder={t("lobby.enterCode")}
            className="flex-1 px-3 py-2 border border-amber-700 rounded-lg text-amber-950 text-sm outline-none focus:ring-2 focus:ring-amber-500 bg-white"
          />
          <MenuButton
            title={t("lobby.join")}
            onClick={handleJoin}
            disabled={!input.trim() || status !== "waiting"}
          />
        </div>
        {(status === "idle" || status === "connected") && (
          <p className="text-xs text-amber-600">
            {status === "connected"
              ? t("lobby.connected")
              : t("lobby.connecting")}
          </p>
        )}
        {hostBusy && (
          <p className="text-xs text-red-600">{t("lobby.hostBusy")}</p>
        )}
        {!hostBusy && status === "error" && (
          <p className="text-xs text-red-600">{t("lobby.error")}</p>
        )}
        {/* <p className="text-xs text-amber-600">{t("lobby.asBlack")}</p> */}
      </div>
      <MenuButton title={`← ${t("landing.back")}`} onClick={handleBack} />
    </div>
  );
};

export default GuestLobbyBlock;
