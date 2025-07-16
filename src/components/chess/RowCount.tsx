import { IncrementProps } from "@/lib/chess-engine/types";

const RowCount: React.FC<IncrementProps> = ({ increment }) => {
  const count: number[] = Array.from({ length: 8 }, (_, i) => 8 - i);
  return (
    <div className="col-span-1  box-border border-amber-950 *:flex *:justify-center *:items-center *:h-20 *:w-20 *:font-semibold *:text-3xl">
      {count.map((c, i) => (
        <p
          key={i}
          className={
            (i + increment) % 2 === 0 ? "bg-amber-600" : "bg-amber-100"
          }
        >
          {c}
        </p>
      ))}
    </div>
  );
};

export default RowCount;
