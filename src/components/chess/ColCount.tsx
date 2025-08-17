import { usePlayerState } from "@/context/PlayerStateContext";
import { IncrementProps } from "@/lib/chess-engine/types";

const ColCount: React.FC<IncrementProps> = ({ increment }) => {
  const { playerState } = usePlayerState();

  const count: string[] = Array.from({ length: 8 }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  return (
    <div className="grid grid-cols-10">
      <div className="col-span-1 bg-amber-800" />
      <div
        className={`col-span-8 border-amber-950 box-border flex *:flex *:justify-center *:items-center `}
      >
        {count.map((c, i) => (
          <p
            key={i}
            className={`${
              (i + increment) % 2 === 0 ? "bg-amber-600" : "bg-amber-100"
            } h-12 w-12 text-xl md:h-14 md:w-14 md:text-2xl font-semibold ${
              playerState.color === "white" ? "rotate-0" : "rotate-180"
            }`}
          >
            {c}
          </p>
        ))}
      </div>
      <div className="col-span-1 bg-amber-800" />
    </div>
  );
};

export default ColCount;
