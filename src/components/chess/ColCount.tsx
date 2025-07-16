import { IncrementProps } from "@/lib/chess-engine/types";

const ColCount: React.FC<IncrementProps> = ({ increment }) => {
  const count: string[] = Array.from({ length: 8 }, (_, i) =>
    String.fromCharCode(65 + i)
  );
  return (
    <div className="grid grid-cols-10">
      <div className="col-span-1 bg-amber-800" />
      <div className="col-span-8 border-amber-950 box-border flex *:flex *:justify-center *:items-center *:h-20 *:w-20 *:text-4xl">
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
      <div className="col-span-1 bg-amber-800" />
    </div>
  );
};

export default ColCount;
