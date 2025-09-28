type HeaderButtonProps = {
  title: string;
  style: string;
  handleClick?: () => void;
  id?: string;
};

const HeaderButton: React.FC<HeaderButtonProps> = ({
  title,
  style,
  handleClick,
  id,
}) => {
  return (
    <>
      {handleClick ? (
        <button
          onClick={handleClick}
          className={`px-2 py-1 cursor-pointer ${style} text-amber-950 hover:text-amber-50 rounded-lg font-medium transform transition-colors duration-300 shadow-md`}
        >
          {title}
        </button>
      ) : (
        <button
          id={id}
          className={`px-2 py-1 cursor-pointer ${style} text-amber-950 hover:text-amber-50 rounded-lg font-medium transform transition-colors duration-300 shadow-md`}
        >
          {title}
        </button>
      )}
    </>
  );
};

export default HeaderButton;
