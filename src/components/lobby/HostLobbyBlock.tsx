import { useGlobalState } from "@/context/GlobalStateContext";
import { useP2PContext } from "@/context/P2PContext";
import MenuButton from "../landing/MenuButton";
import { useState } from "react";

type HostLobbyProps = { selectedGame: string | null; handleBack: () => void };

const HostLobbyBlock = ({ handleBack }: HostLobbyProps) => {
  const { t, locale } = useGlobalState();
  const { peerId, status } = useP2PContext();

  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyCode = () => {
    if (!peerId) return;
    navigator.clipboard.writeText(peerId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    if (!peerId) return;
    const link = `${window.location.origin}/${locale}/lobby?guest&join=${peerId}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <div className="flex flex-col gap-3"></div>
      <div className="flex flex-col gap-3 p-4 border-2 border-amber-950 rounded-2xl bg-amber-50">
        {peerId ? (
          <>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-amber-800">
                {t("lobby.yourCode")}
              </p>
              <div className="flex flex-col gap-2">
                <code className="flex-1 px-3 py-2 bg-amber-100 border border-amber-300 rounded-lg text-amber-950 font-mono text-sm break-all select-all">
                  {peerId}
                </code>
                <MenuButton
                  title={copied ? t("lobby.copied") : t("lobby.copy")}
                  onClick={handleCopyCode}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-amber-800">
                {t("lobby.orShareLink")}
              </p>
              <MenuButton
                title={copiedLink ? t("lobby.linkCopied") : t("lobby.copyLink")}
                onClick={handleCopyLink}
              />
            </div>
          </>
        ) : (
          <p className="text-amber-400 text-sm">{t("lobby.gettingCode")}</p>
        )}
        <p className="text-xs text-amber-600">
          {status === "waiting"
            ? t("lobby.waiting")
            : status === "connected"
              ? t("lobby.connected")
              : t("lobby.connecting")}
        </p>
        {/* <p className="text-xs text-amber-600">{t("lobby.asWhite")}</p> */}
      </div>

      <MenuButton title={`← ${t("landing.back")}`} onClick={handleBack} />
    </div>
  );
};

export default HostLobbyBlock;
