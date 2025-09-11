"use client";
import { useGlobalState } from "@/context/GlobalStateContext";
import HomeIcon from "@/lib/icons/HomeIcon";
import LocaleIcon from "@/lib/icons/LocaleIcon";
import { MouseEvent, TouchEvent, useState } from "react";

const LocaleBlock = () => {
  const { locale, setLocale, t } = useGlobalState();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClick = (e: MouseEvent | TouchEvent) => {
    const target = e.target as HTMLElement;

    const en = target.closest("#en");
    const fr = target.closest("#fr");
    const ru = target.closest("#ru");

    if (en && locale !== "en") setLocale("en");
    if (fr && locale !== "fr") setLocale("fr");
    if (ru && locale !== "ru") setLocale("ru");
    setIsOpen(false);
  };

  return (
    <div className="absolute top-0 right-0 p-2">
      <div className="relative flex gap-2 z-10 font-semibold">
        <button
          // onClick={() => setShowMenuModal(true)}
          className="p-1 bg-amber-800 text-white rounded-lg hover:bg-amber-900 cursor-pointer transition duration-100 ease-in-out"
        >
          <p className="hidden text-sm md:block">{t("mainMenu")}</p>
          <div className="block w-7.5 h-7.5 md:hidden">
            <HomeIcon />
          </div>
        </button>
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="p-1 text-sm flex justify-center items-center bg-amber-100 hover:bg-amber-150 md:rounded-bl-lg rounded-tl-lg rounded-tr-lg cursor-pointer transition duration-100 ease-in-out"
        >
          <p className="hidden md:block">{`${t("currentTranslation")}: `}</p>
          <span className="md:pl-2 flex justify-center items-center w-10 h-7.5">
            <LocaleIcon locale={locale} />
          </span>
        </button>
        <div
          onClick={(e) => handleClick(e)}
          className={`pt-1 pb-2 absolute top-full right-0 ${
            isOpen ? "w-11 pr-1 " : "w-0"
          } bg-amber-100 overflow-hidden transition-all duration-150 ease-in-out flex flex-col justify-end items-end gap-3`}
        >
          <span
            id="en"
            className="py-1 hover:ring-4 hover:ring-amber-150 flex justify-center items-center cursor-pointer w-8 h-6"
          >
            <LocaleIcon locale={"en"} />
          </span>
          <span
            id="fr"
            className="py-1 hover:ring-4 hover:ring-amber-150 flex justify-center items-center cursor-pointer w-8 h-6"
          >
            <LocaleIcon locale={"fr"} />
          </span>
          <span
            id="ru"
            className="py-1 hover:ring-4 hover:ring-amber-150 flex justify-center items-center cursor-pointer w-8 h-6"
          >
            <LocaleIcon locale={"ru"} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default LocaleBlock;
