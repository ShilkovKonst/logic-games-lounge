import { TurnDetails } from "@/lib/chess-engine/types";
import { Dispatch, MouseEvent, SetStateAction, TouchEvent } from "react";

type ConfirmationBoxProps = {
  setIsReset: Dispatch<SetStateAction<boolean>>;
  turn: TurnDetails;
  confirmClick: (turn: TurnDetails) => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
};

const ConfirmationBox: React.FC<ConfirmationBoxProps> = ({
  setIsReset,
  turn,
  confirmClick,
  title,
  message,
  confirmText,
  cancelText,
}) => {
  const handleClick = (e: MouseEvent | TouchEvent) => {
    const target = e.target as HTMLElement;
    const foreground = target.closest("#foreground");
    const cancel = target.closest("#cancel-button");
    const confirm = target.closest("#confirm-button");
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
          <button
            id="confirm-button"
            className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg"
          >
            {confirmText}
          </button>
          <button
            id="cancel-button"
            className="px-6 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationBox;
