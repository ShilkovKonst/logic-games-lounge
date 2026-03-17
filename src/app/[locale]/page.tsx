"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGlobalState } from "@/context/GlobalStateContext";

const GAMES = ["chess"] as const;

export default function LandingPage() {
  const { t } = useGlobalState();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const [hotseat, setHotseat] = useState(false);

  return (
    <main className="font-sans flex flex-col items-center justify-center min-h-screen gap-10 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-amber-950 tracking-tight">
          Logic Games Lounge
        </h1>
        <p className="text-amber-800 mt-2 font-semibold text-sm">
          {hotseat ? t("landing.chooseGame") : t("landing.chooseMode")}
        </p>
      </div>

      {!hotseat ? (
        <div className="flex flex-col gap-3 w-48">
          <MenuButton
            title={t("landing.hotseat")}
            onClick={() => setHotseat(true)}
          />
          <MenuButton
            title={t("landing.online")}
            onClick={() => router.push(`/${locale}/lobby`)}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-3 w-48">
          {GAMES.map((game) => (
            <MenuButton
              key={game}
              title={t(`landing.${game}`)}
              onClick={() => router.push(`/${locale}/${game}`)}
            />
          ))}
          <MenuButton
            title={`← ${t("landing.back")}`}
            onClick={() => setHotseat(false)}
          />
        </div>
      )}
    </main>
  );
}

function MenuButton({ title, onClick }: { title: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-amber-700 hover:bg-amber-600 text-amber-50 hover:text-amber-950 inset-shadow-log-amberdark
        h-12 w-full py-1 px-4 flex justify-center items-center rounded-lg cursor-pointer transition duration-200 ease-in-out text-sm font-medium"
    >
      {title}
    </button>
  );
}
