import React from "react";

type CopyButtonProps = {
  label: string;
  onClick: () => void;
  full?: boolean;
  disabled?: boolean;
};

function CopyButton({ label, onClick, full, disabled }: CopyButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-amber-700 hover:bg-amber-600 text-amber-50 hover:text-amber-950 inset-shadow-log-amberdark
        px-3 h-10 flex items-center justify-center rounded-lg text-sm transition duration-200 ease-in-out whitespace-nowrap cursor-pointer
        disabled:opacity-40 disabled:cursor-not-allowed
        ${full ? "w-full" : ""}`}
    >
      {label}
    </button>
  );
}

export default CopyButton;
