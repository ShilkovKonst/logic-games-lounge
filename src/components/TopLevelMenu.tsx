"use client";
import LocaleBlock from "./locale/LocaleBlock";
import TopLevelButton from "./TopLevelButton";
import { useState } from "react";
import HomeIcon from "@/lib/icons/HomeIcon";
import OpenIcon from "@/lib/icons/OpenIcon";
import HideIcon from "@/lib/icons/HideIcon";
import { useParams } from "next/navigation";
import { Locale, t } from "@/lib/locales/locale";

const TopLevelMenu = () => {
  const { locale } = useParams<{ locale: Locale }>();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className={`fixed top-0 right-0 p-2 pr-0 z-10 `}>
      <div className={`${isOpen ? "hidden" : "block"} md:hidden`}>
        <TopLevelButton
          Icon={OpenIcon}
          title={t(locale, "mainMenu")}
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
            title={t(locale, "mainMenu")}
            handleClick={() => {}}
            isMenuButton={true}
            withText
          />
          <LocaleBlock isMenuOpen={isOpen} />
          <div className={`block md:hidden`}>
            <TopLevelButton
              Icon={HideIcon}
              title={t(locale, "mainMenu")}
              handleClick={() => setIsOpen(false)}
              isMenuButton={true}
              withText={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopLevelMenu;
