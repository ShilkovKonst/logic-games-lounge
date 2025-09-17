import { usePlayerState } from "@/context/PlayerStateContext";
import { IncrementProps } from "@/lib/chess-engine/types";

const ColCount: React.FC<IncrementProps> = ({ increment }) => {
  const { playerState } = usePlayerState();

  const count: string[] = Array.from({ length: 8 }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  return (
    <div className="grid grid-cols-9">
      <div className="col-span-1 bg-amber-800 h-[44px] w-[44px] text-xl md:h-[50px] md:w-[50px] md:text-2xl font-semibold" />
      <div
        className={`col-span-8 border-amber-950 box-border flex *:flex *:justify-center *:items-center `}
      >
        {count
          .sort((a, b) => (playerState.color === "white" ? a.localeCompare(b) : b.localeCompare(a)))
          .map((c, i) => (
            <p
              key={i}
              className={`${
                (i + increment) % 2 === 0 ? "bg-amber-600" : "bg-amber-100"
              } h-[44px] w-[44px] text-xl md:h-[50px] md:w-[50px] md:text-2xl font-semibold last:border-amber-950 last:border-r-2`}
            >
              {c}
            </p>
          ))}
      </div>
      {/* <div className="col-span-1 bg-amber-800 h-[44px] w-[44px] text-xl md:h-[50px] md:w-[50px] md:text-2xl font-semibold" /> */}
    </div>
  );
};

export default ColCount;
