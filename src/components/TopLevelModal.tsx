import { useGlobalState } from "@/context/GlobalStateContext";
import { usePathname } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

type TopLevelModalProps = {
  setShowLeaveConfirm: Dispatch<SetStateAction<boolean>>;
  handleLeaveConfirm: () => void;
};

const TopLevelModal = ({
  setShowLeaveConfirm,
  handleLeaveConfirm,
}: TopLevelModalProps) => {
  const { t } = useGlobalState();
  const pathname = usePathname();

  return (
    <div
      className="fixed right-0 inset-0 bg-black/30 z-50 flex items-center justify-center"
      onClick={() => setShowLeaveConfirm(false)}
    >
      <div
        className="bg-amber-50 bg-opacity-95 rounded-3xl p-8 text-center shadow-2xl max-w-md w-11/12 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-semibold text-amber-900 mb-4">
          {t("chess.modal.leave.title")}
        </h3>
        <p className="text-amber-800 mb-6">
          {pathname.includes("online")
            ? t("chess.modal.leave.message.online")
            : t("chess.modal.leave.message.offline")}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleLeaveConfirm}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-amber-950 hover:text-amber-50 rounded-lg font-medium transition-colors duration-300 shadow-md cursor-pointer"
          >
            {t("chess.modal.leave.confirm")}
          </button>
          <button
            onClick={() => setShowLeaveConfirm(false)}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-amber-950 hover:text-amber-50 rounded-lg font-medium transition-colors duration-300 shadow-md cursor-pointer"
          >
            {t("chess.modal.leave.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopLevelModal;
