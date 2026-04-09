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
import TopLevelModal from "./TopLevelModal";

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

  const handleLeaveConfirm = () => {
    if (isOnline) leaveGame();
    setShowLeaveConfirm(false);
    router.push(`/${locale}`);
  };

  return (
    <>
      {showLeaveConfirm && (
        <TopLevelModal
          setShowLeaveConfirm={setShowLeaveConfirm}
          handleLeaveConfirm={handleLeaveConfirm}
        />
      )}

      <div className={`fixed top-0 right-0 p-2 pr-0 z-10`}>
        <div className={`${isOpen ? "hidden" : "block"} md:hidden`}>
          <TopLevelButton
            Icon={OpenIcon}
            title={t("mainMenu")}
            handleClick={() => setIsOpen(true)}
            withText={false}
          />
        </div>
        <div
          className={`absolute top-0 right-0 py-2 z-20 w-[136px] md:w-70 ${
            isOpen ? "block" : "hidden"
          } md:block`}
        >
          <div className="relative flex flex-row md:flex-col lg:flex-row justify-end items-end gap-2 font-semibold md:pr-2">
            <TopLevelButton
              Icon={HomeIcon}
              title={t("nav.home")}
              handleClick={() => setShowLeaveConfirm(true)}
              withText
            />
            <LocaleBlock isMenuOpen={isOpen} />
            <div className={`block md:hidden`}>
              <TopLevelButton
                Icon={HideIcon}
                title={t("mainMenu")}
                handleClick={() => setIsOpen(false)}
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
