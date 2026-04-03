import { Locale } from "@/lib/locales/locale";

type TopLevelButtonProps = {
  Icon: React.FC;
  title: string;
  locale?: Locale;
  handleClick: () => void;
  withText: boolean;
};

const TopLevelButton: React.FC<TopLevelButtonProps> = ({
  Icon,
  title,
  handleClick,
  withText,
}) => {
  return (
    <>
      {withText ? (
        <button
          onClick={handleClick}
          className={`group bg-amber-700 hover:bg-amber-600 text-amber-50 hover:text-amber-950 inset-shadow-log-amberdark
           h-12 w-12 md:h-8 md:w-10 py-1 px-2 gap-1 flex justify-center items-center rounded-lg cursor-pointer hover:w-12 hover:md:w-32 transition-all duration-100 ease-in-out`}
        >
          <div
            className={`flex justify-center items-center h-10 w-10 md:w-6 md:h-6`}
          >
            <Icon />
          </div>
          <p className="w-0 text-nowrap overflow-hidden opacity-0 text-sm hidden md:block group-hover:w-auto group-hover:opacity-100 transition-opacity duration-100 ease-in-out">
            {title}
          </p>
        </button>
      ) : (
        <button
          onClick={handleClick}
          className={`bg-amber-900 text-amber-50 
           h-12 w-6 md:h-8 md:w-6 py-1 px-2 gap-1 flex justify-center items-center rounded-l-lg cursor-pointer transition duration-200 ease-in-out`}
        >
          <div
            className={`flex justify-center items-center h-10 w-10 md:w-6 md:h-6`}
          >
            <Icon />
          </div>
        </button>
      )}
    </>
  );
};

export default TopLevelButton;
