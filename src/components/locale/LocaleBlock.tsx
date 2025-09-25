/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";
import { LocaleIcon, SwitchLanguageIcon } from "@/lib/icons/LocaleIcon";
import { Locale, t } from "@/lib/locales/locale";
import { MouseEvent, TouchEvent, useEffect, useState } from "react";
import TopLevelButton from "../TopLevelButton";
import { useParams, usePathname, useRouter } from "next/navigation";

type LocaleProps = {
  isMenuOpen: boolean;
};

const LocaleBlock: React.FC<LocaleProps> = ({ isMenuOpen }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useParams();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  function setLocale(newLocale: Locale) {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
    return router.push(segments.join("/"));
  }

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

  useEffect(() => {
    !isMenuOpen && setIsOpen(false);
  }, [isMenuOpen]);

  return (
    <>
      <TopLevelButton
        Icon={SwitchLanguageIcon}
        title={`${t(locale as Locale, "currentLanguage")}`}
        handleClick={() => setIsOpen((prev) => !prev)}
        isMenuButton={false}
        withText
      />
      <div
        onClick={(e) => handleClick(e)}
        className={`mt-2 py-2 absolute top-full right-0 rounded-l-lg w-12 px-2 ${
          isOpen ? "block" : "hidden"
        } bg-amber-600 overflow-hidden flex flex-col justify-end items-end gap-4`}
      >
        {["en", "fr", "ru"].map((l) => (
          <div
            key={l}
            id={l}
            className={`hover:ring-8 hover:ring-amber-800 ${
              locale === l ? "ring-8 ring-amber-800" : ""
            } flex justify-center items-center cursor-pointer w-8 h-6`}
          >
            <LocaleIcon locale={l as Locale} />
          </div>
        ))}
      </div>
    </>
  );
};

export default LocaleBlock;
