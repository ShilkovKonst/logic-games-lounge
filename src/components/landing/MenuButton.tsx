import React from "react";

type MenuButtonProps = {
  title: string;
  onClick: () => void;
  disabled?: boolean;
};

function MenuButton({ title, onClick, disabled }: MenuButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="bg-amber-700 hover:bg-amber-600 text-amber-50 hover:text-amber-950 inset-shadow-log-amberdark
        h-12 w-full py-1 px-4 flex justify-center items-center rounded-lg cursor-pointer transition duration-200 ease-in-out text-sm font-medium
        disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {title}
    </button>
  );
}

export default MenuButton;
