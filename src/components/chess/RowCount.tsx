import { usePlayerState } from "@/context/PlayerStateContext";
import { IncrementProps } from "@/lib/chess-engine/types";

const RowCount: React.FC<IncrementProps> = ({ increment }) => {
  const { playerState } = usePlayerState();

  const count: number[] = Array.from({ length: 8 }, (_, i) => 8 - i);
  
  return (
    <div className="col-span-1 box-border border-amber-950 *:flex *:justify-center *:items-center *:font-semibold">
      {count.map((c, i) => (
        <p
          key={i}
          className={`${
            (i + increment) % 2 === 0 ? "bg-amber-600" : "bg-amber-100"
          } h-[44px] w-[44px] text-xl md:h-[50px] md:w-[50px] md:text-2xl ${
            playerState.color === "white" ? "rotate-0" : "rotate-180"
          }`}
        >
          {c}
        </p>
      ))}
    </div>
  );
};

export default RowCount;
