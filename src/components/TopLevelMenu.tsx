"use client";
import { useGlobalState } from "@/context/GlobalStateContext";
import LocaleBlock from "./locale/LocaleBlock";
import TopLevelButton from "./TopLevelButton";
import { useState } from "react";
import HomeIcon from "@/lib/icons/HomeIcon";
import OpenIcon from "@/lib/icons/OpenIcon";
import HideIcon from "@/lib/icons/HideIcon";

const TopLevelMenu = () => {
  const { t } = useGlobalState();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className={`fixed top-0 right-0 p-2 pr-0 z-10 `}>
      <div className={`${isOpen ? "hidden" : "block"}`}>
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
        }`}
      >
        <div className="relative flex justify-start items-center gap-2 font-semibold">
          <TopLevelButton
            Icon={HomeIcon}
            title={t("mainMenu")}
            handleClick={() => {}}
            isMenuButton={true}
            withText
          />
          <LocaleBlock isMenuOpen={isOpen} />
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
  );
};

export default TopLevelMenu;
