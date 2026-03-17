"use client";
import LocaleBlock from "./locale/LocaleBlock";
import TopLevelButton from "./TopLevelButton";
import { useState } from "react";
import HomeIcon from "@/lib/icons/HomeIcon";
import OpenIcon from "@/lib/icons/OpenIcon";
import HideIcon from "@/lib/icons/HideIcon";
import { useGlobalState } from "@/context/GlobalStateContext";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useP2PContext } from "@/context/P2PContext";

const TopLevelMenu = () => {
  const { t } = useGlobalState();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  const { leaveGame } = useP2PContext();

  const isLanding = pathname === `/${locale}`;
  const isLobby = pathname === `/${locale}/lobby`;
  const isOnline = pathname.includes("/online");

  if (isLanding || isLobby) return null;

  const goHome = () => {
    if (isOnline) {
      setShowLeaveConfirm(true);
    } else {
      router.push(`/${locale}`);
    }
  };

  const handleLeaveConfirm = () => {
    leaveGame();
    setShowLeaveConfirm(false);
    router.push(`/${locale}`);
  };

  return (
    <>
      {showLeaveConfirm && (
        <div
          className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center"
          onClick={() => setShowLeaveConfirm(false)}
        >
          <div
            className="bg-amber-50 bg-opacity-95 rounded-3xl p-8 text-center shadow-2xl max-w-md w-11/12 mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-amber-900 mb-4">
              {t("chess.online.leave.title")}
            </h3>
            <p className="text-amber-800 mb-6">{t("chess.online.leave.message")}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleLeaveConfirm}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-amber-950 hover:text-amber-50 rounded-lg font-medium transition-colors duration-300 shadow-md cursor-pointer"
              >
                {t("chess.online.leave.confirm")}
              </button>
              <button
                onClick={() => setShowLeaveConfirm(false)}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-amber-950 hover:text-amber-50 rounded-lg font-medium transition-colors duration-300 shadow-md cursor-pointer"
              >
                {t("chess.online.leave.cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`fixed top-0 right-0 p-2 pr-0 z-10`}>
        <div className={`${isOpen ? "hidden" : "block"} md:hidden`}>
          <TopLevelButton
            Icon={OpenIcon}
            title={t("mainMenu")}
            handleClick={() => setIsOpen(true)}
            isMenuButton={true}
            withText={false}
          />
        </div>
        <div
          className={`absolute top-0 right-0 py-2 z-20 w-[136px] md:w-70 ${
            isOpen ? "block" : "hidden"
          } md:block`}
        >
          <div className="relative flex justify-start items-center gap-2 font-semibold">
            <TopLevelButton
              Icon={HomeIcon}
              title={t("nav.home")}
              handleClick={goHome}
              isMenuButton={true}
              withText
            />
            <LocaleBlock isMenuOpen={isOpen} />
            <div className={`block md:hidden`}>
              <TopLevelButton
                Icon={HideIcon}
                title={t("mainMenu")}
                handleClick={() => setIsOpen(false)}
                isMenuButton={true}
                withText={false}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopLevelMenu;
