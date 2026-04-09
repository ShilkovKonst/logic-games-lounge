"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useP2PContext } from "@/context/P2PContext";
import { useGlobalState } from "@/context/GlobalStateContext";
import LocaleBlock from "@/components/locale/LocaleBlock";

type View = "select" | "host" | "guest";

const GAMES = [{ id: "chess", emoji: "♟" }];

export default function LobbyPage() {
  const { t } = useGlobalState();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = params.locale as string;

  const { peerId, status, gameToPlay, hostBusy, enable, connect, startGame } = useP2PContext();

  const [view, setView] = useState<View>("select");
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  // Peer ID to connect to once PeerJS is ready (used for auto-join via link)
  const [autoJoin, setAutoJoin] = useState<string | null>(null);

  useEffect(() => { enable(); }, [enable]);

  // Handle ?join=PEER_ID link — switch to guest view and queue auto-connect
  useEffect(() => {
    const joinCode = searchParams.get("join");
    if (joinCode) {
      setAutoJoin(joinCode);
      setInput(joinCode);
      setView("guest");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-connect once PeerJS is initialised and autoJoin is set
  useEffect(() => {
    if (autoJoin && status === "waiting") {
      connect(autoJoin);
      setAutoJoin(null);
    }
  }, [autoJoin, status, connect]);

  useEffect(() => {
    if (status === "connected" && selectedGame) startGame(selectedGame);
  }, [status, selectedGame, startGame]);

  useEffect(() => {
    if (gameToPlay && status === "connected") {
      router.push(`/${locale}/${gameToPlay}/online`);
    }
  }, [gameToPlay, status, router, locale]);

  const handleJoin = () => {
    const code = input.trim();
    if (!code) return;
    connect(code);
  };

  const handleCopyCode = () => {
    if (!peerId) return;
    navigator.clipboard.writeText(peerId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    if (!peerId) return;
    const link = `${window.location.origin}/${locale}/lobby?join=${peerId}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

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

      {view === "select" && (
        <div className="flex flex-col gap-3 w-48">
          <MenuButton title={t("lobby.createGame")} onClick={() => setView("host")} />
          <MenuButton title={t("lobby.joinGame")} onClick={() => setView("guest")} />
          <MenuButton title={`← ${t("landing.back")}`} onClick={() => router.push(`/${locale}`)} />
        </div>
      )}

      {view === "host" && (
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <p className="text-sm font-semibold text-amber-800 text-center">{t("lobby.selectGame")}</p>
          <div className="flex flex-col gap-3">
            {GAMES.map((g) => (
              <MenuButton
                key={g.id}
                title={`${g.emoji} ${t(`landing.${g.id}`)}`}
                onClick={() => setSelectedGame(g.id)}
                active={selectedGame === g.id}
              />
            ))}
          </div>
          {selectedGame && (
            <div className="flex flex-col gap-3 p-4 border-2 border-amber-950 rounded-2xl bg-amber-50">
              {peerId ? (
                <>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold text-amber-800">{t("lobby.yourCode")}</p>
                    <div className="flex gap-2">
                      <code className="flex-1 px-3 py-2 bg-amber-100 border border-amber-300 rounded-lg text-amber-950 font-mono text-sm break-all select-all">
                        {peerId}
                      </code>
                      <CopyButton
                        label={copied ? t("lobby.copied") : t("lobby.copy")}
                        onClick={handleCopyCode}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold text-amber-800">{t("lobby.orShareLink")}</p>
                    <CopyButton
                      label={copiedLink ? t("lobby.linkCopied") : t("lobby.copyLink")}
                      onClick={handleCopyLink}
                      full
                    />
                  </div>
                </>
              ) : (
                <p className="text-amber-400 text-sm">{t("lobby.gettingCode")}</p>
              )}
              <p className="text-xs text-amber-600">
                {status === "waiting" ? t("lobby.waiting") : status === "connected" ? t("lobby.connected") : t("lobby.connecting")}
              </p>
              <p className="text-xs text-amber-600">{t("lobby.asWhite")}</p>
            </div>
          )}
          <MenuButton title={`← ${t("landing.back")}`} onClick={() => setView("select")} />
        </div>
      )}

      {view === "guest" && (
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <div className="flex flex-col gap-3 p-4 border-2 border-amber-950 rounded-2xl bg-amber-50">
            <p className="text-sm font-semibold text-amber-800">{t("lobby.joinGame")}</p>
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                placeholder={t("lobby.enterCode")}
                className="flex-1 px-3 py-2 border border-amber-700 rounded-lg text-amber-950 text-sm outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              />
              <CopyButton
                label={t("lobby.join")}
                onClick={handleJoin}
                disabled={!input.trim() || status !== "waiting"}
              />
            </div>
            {(status === "idle" || status === "connected") && (
              <p className="text-xs text-amber-600">
                {status === "connected" ? t("lobby.connected") : t("lobby.connecting")}
              </p>
            )}
            {hostBusy && (
              <p className="text-xs text-red-600">{t("lobby.hostBusy")}</p>
            )}
            {!hostBusy && status === "error" && (
              <p className="text-xs text-red-600">{t("lobby.error")}</p>
            )}
            <p className="text-xs text-amber-600">{t("lobby.asBlack")}</p>
          </div>
          <MenuButton title={`← ${t("landing.back")}`} onClick={() => setView("select")} />
        </div>
      )}
    </main>
  );
}

function MenuButton({
  title,
  onClick,
  active,
  disabled,
}: {
  title: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-amber-700 hover:bg-amber-600 text-amber-50 hover:text-amber-950 inset-shadow-log-amberdark
        h-12 w-full flex justify-center items-center rounded-lg cursor-pointer transition duration-200 ease-in-out text-sm font-medium
        disabled:opacity-40 disabled:cursor-not-allowed
        ${active ? "ring-2 ring-amber-950" : ""}`}
    >
      {title}
    </button>
  );
}

function CopyButton({
  label,
  onClick,
  full,
  disabled,
}: {
  label: string;
  onClick: () => void;
  full?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-amber-700 hover:bg-amber-600 text-amber-50 hover:text-amber-950 inset-shadow-log-amberdark
        px-3 h-10 flex items-center justify-center rounded-lg text-sm transition duration-200 ease-in-out whitespace-nowrap cursor-pointer
        disabled:opacity-40 disabled:cursor-not-allowed
        ${full ? "w-full" : ""}`}
    >
      {label}
    </button>
  );
}
