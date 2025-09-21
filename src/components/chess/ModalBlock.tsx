import { TurnDetails } from "@/lib/chess-engine/types";
import { Dispatch, MouseEvent, SetStateAction, TouchEvent } from "react";
import HeaderButton from "./HeaderButton";

type ConfirmationBlockProps = {
  setIsReset: Dispatch<SetStateAction<boolean>>;
  turn: TurnDetails;
  confirmClick: (turn: TurnDetails) => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
};

const ModalBlock: React.FC<ConfirmationBlockProps> = ({
  turn,
  title,
  message,
  confirmText,
  cancelText,
  setIsReset,
  confirmClick,
}) => {
  const handleClick = (e: MouseEvent | TouchEvent) => {
    const target = e.target as HTMLElement;
    const foreground = target.closest("#foreground");
    const cancel = target.closest("#cancel");
    const confirm = target.closest("#confirm");
    const body = target.closest("#body");

    if (confirm) {
      confirmClick(turn);
      setIsReset(false);
      return;
    }
    if (cancel) {
      setIsReset(false);
      return;
    }
    if (body) {
      return;
    }
    if (foreground) {
      setIsReset(false);
      return;
    }
  };

  return (
    <div
      id="foreground"
      onClick={(e) => handleClick(e)}
      className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div
        id="body"
        className="bg-amber-50 bg-opacity-95 rounded-3xl p-8 text-center shadow-2xl max-w-md w-11/12 mx-4"
      >
        <h3 className="text-xl font-semibold text-amber-900 mb-4">{title}</h3>
        <p className="text-amber-800 mb-6">{message}</p>
        <div className="flex gap-4 justify-center">
          <HeaderButton
            id="confirm"
            title={confirmText}
            style="bg-red-500 hover:bg-red-600"
          />
          <HeaderButton
            id="cancel"
            title={cancelText}
            style="bg-gray-500 hover:bg-gray-600"
          />
        </div>
      </div>
    </div>
  );
};

export default ModalBlock;
