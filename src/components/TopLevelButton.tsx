import type { FC } from "react";

type TopLevelButtonProps = {
  Icon: React.FC;
  title: string;
  handleClick: () => void;
  withText: boolean;
};

const TopLevelButton: FC<TopLevelButtonProps> = ({ Icon, title, handleClick, withText }) => {
  return (
    <button
      onClick={handleClick}
      className={[
        "text-amber-50 h-12 md:h-8 py-1 px-2 gap-1 flex justify-center items-center cursor-pointer ease-in-out",
        withText
          ? "group bg-amber-700 hover:bg-amber-600 hover:text-amber-950 inset-shadow-log-amberdark w-12 md:w-10 lg:w-32 rounded-lg hover:w-12 hover:md:w-32 transition-[width] duration-100"
          : "bg-amber-900 w-6 rounded-l-lg transition duration-200",
      ].join(" ")}
    >
      <div className="flex justify-center items-center h-10 w-10 md:w-6 md:h-6">
        <Icon />
      </div>
      {withText && (
        <p className="w-auto md:w-0 lg:w-auto text-nowrap overflow-hidden opacity-100 md:opacity-0 lg:opacity-100 text-sm hidden md:block group-hover:md:w-auto group-hover:md:opacity-100 transition-opacity duration-100 ease-in-out">
          {title}
        </p>
      )}
    </button>
  );
};

export default TopLevelButton;
