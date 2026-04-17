import React from "react";

type DividerProps = { text?: string };

const DividerBlock = ({ text }: DividerProps) => {
  return (
    <div className="flex justify-center items-center gap-1">
      <div className="border-t-2 border-amber-900 w-full" />
      {text && (
        <p className="text-amber-900 font-semibold text-sm uppercase">{text}</p>
      )}
      {text && <div className="border-t-2 border-amber-900 w-full" />}
    </div>
  );
};

export default DividerBlock;
