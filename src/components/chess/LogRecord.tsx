import { useGlobalState } from "@/context/GlobalStateContext";
import { getDisambiguation, getSAN } from "@/lib/chess-engine/constants/san";
import { Pieces, TurnDetails } from "@/lib/chess-engine/types";
import UndoIcon from "@/lib/icons/UndoIcon";

type LogRecordProps = {
  turn: TurnDetails;
  handleClick: () => void;
};

const LogRecord: React.FC<LogRecordProps> = ({ turn, handleClick }) => {
  const { t } = useGlobalState();

  const {
    turnNo,
    curentPlayer,
    fromCell,
    toCell,
    pieceToMove,
    pieceToTake,
    pieceToExchange,
    isEnPassant,
    isExchange,
    castling,
    check,
    checkmate,
    draw,
    ambiguity,
  } = turn;

  const title = () => {
    let title = `${turnNo} - ${t(`chess.glossary.color.${curentPlayer}`)}`;
    if (pieceToMove)
      title += ` : ${t(`chess.glossary.pieces.${pieceToMove?.slice(0, -2)}`)}`;
    if (fromCell && toCell)
      title += ` ${t(`chess.log.moves`, {
        fromCell: fromCell,
        toCell: toCell,
      })}`;
    if (pieceToTake)
      title += `; ${t(`chess.log.takes`, {
        pieceToTake: t(`chess.glossary.pieces.${pieceToTake?.slice(0, -2)}`),
      })}`;
    if (isEnPassant) title += ` ${t(`chess.glossary.enPassant`)}`;
    if (castling) title += `; ${t(`chess.glossary.castling.${castling}`)}`;
    if (isExchange && pieceToExchange)
      title += `; ${t(`chess.log.promotes`, {
        pieceToExchange: t(`chess.glossary.pieces.${pieceToExchange}`),
      })}`;
    if (check && !checkmate)
      title += `; ${t(`chess.log.checkTo`, {
        color: t(`chess.glossary.color.${check}`),
      })}`;
    if (checkmate)
      title += `; ${t(`chess.log.checkmateTo`, {
        color: t(`chess.glossary.color.${checkmate}`),
      })}`;
    if (draw !== "none")
      title += `; ${t(`chess.log.draw`, {
        draw: t(`chess.glossary.draw.${draw}`),
      })}`;

    return title;
  };

  const san = () => {
    const pieceType: Pieces | undefined = pieceToMove?.slice(0, -2) as Pieces;
    const pieceSAN = getSAN(pieceType);
    const disambiguation =
      fromCell && ambiguity && getDisambiguation(fromCell, ambiguity);

    let sanString = "";
    if (draw !== "none") return "1/2 - 1/2";
    else if (castling) sanString = castling === "long" ? "O-O-O" : "O-O";
    else if (isExchange) {
      const exchangeSAN = pieceToExchange && getSAN(pieceToExchange);
      sanString = pieceToTake
        ? `${pieceSAN}${fromCell?.charAt(0)}x${toCell}=${exchangeSAN}`
        : `${pieceSAN}${toCell}=${exchangeSAN}`;
    } else {
      sanString = `${pieceSAN}${disambiguation}${
        pieceToTake ? (pieceSAN ? "x" : `${fromCell?.charAt(0)}x`) : ""
      }${toCell}`;
    }

    if (check && !checkmate) sanString += "+";
    else if (checkmate) sanString += "#";

    if (pieceToTake && isEnPassant) sanString += " e.p.";
    return sanString;
  };

  return (
    <div className="flex justify-start items-center gap-1 w-[130px] md:w-[112px] h-10 rounded-full  mx-1 bg-linear-to-r from-amber-700 to-transparent hover:from-transparent hover:to-amber-700 transition ease-in-out duration-200">
      <button
        onClick={() => handleClick()}
        className={`cursor-pointer rounded-full bg-amber-700 hover:bg-amber-500 transition ease-in-out duration-200 inset-shadow-log-amberdark`}
      >
        <UndoIcon color={turn.curentPlayer} />
      </button>
      <button title={title()} onTouchStart={() => {}} className="w-full h-full">
        <p className="cursor-default w-full text-start text-sm">{san()}</p>
      </button>
    </div>
  );
};

export default LogRecord;
