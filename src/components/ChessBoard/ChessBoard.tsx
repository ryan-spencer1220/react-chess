import "./ChessBoard.css";
import Tile from "../Tile/Tile";
import { useState, useRef } from "react";
import Rules from "../../ruleset/Rules";
import {
  HORIZONTAL_AXIS,
  VERTICAL_AXIS,
  GRID_SIZE,
  PieceType,
  TeamType,
  Position,
  samePosition,
} from "../../Constants";
import { initialBoardState, Piece } from "../../InitialBoardState";
// import { Rook } from "../../../public/assets/images/rook_w.png";

const ChessBoard = () => {
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const [promotionPawn, setPromotionPawn] = useState<Piece>();
  const [grabPosition, setGrabPosition] = useState<Position>({ x: 0, y: 0 });
  const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
  const chessBoardRef = useRef<HTMLDivElement>(null);
  const rulesetRef = new Rules();
  const modalRef = useRef<HTMLDivElement>(null);

  function grabPiece(e: React.MouseEvent) {
    const element = e.target as HTMLElement;
    const chessBoard = chessBoardRef.current;

    if (element.classList.contains("chess-piece") && chessBoard) {
      setGrabPosition({
        x: Math.floor((e.clientX - chessBoard.offsetLeft) / GRID_SIZE),
        y: Math.abs(Math.ceil((e.clientY - chessBoard.offsetTop - 800) / GRID_SIZE)),
      });

      const x = e.clientX - GRID_SIZE / 2;
      const y = e.clientY - GRID_SIZE / 2;
      element.style.position = "absolute";
      element.style.left = x + "px";
      element.style.top = y + "px";

      setActivePiece(element);
    }
  }

  function movePiece(e: React.MouseEvent) {
    const chessBoard = chessBoardRef.current;
    if (activePiece && chessBoard) {
      const x = e.clientX - 50;
      const y = e.clientY - 50;
      const minX = chessBoard.offsetLeft - 25;
      const minY = chessBoard.offsetTop - 25;
      const maxX = chessBoard.offsetLeft + chessBoard.clientWidth - 75;
      const maxY = chessBoard.offsetTop + chessBoard.clientHeight - 25;
      activePiece.style.position = "absolute";

      if (x < minX) {
        activePiece.style.left = minX + "px";
      } else if (x > maxX) {
        activePiece.style.left = maxX + "px";
      } else {
        activePiece.style.left = x + "px";
      }

      if (y < minY) {
        activePiece.style.top = minY + "px";
      } else if (y > maxY) {
        activePiece.style.top = maxY + "px";
      } else {
        activePiece.style.top = y + "px";
      }
    }
  }

  function dropPiece(e: React.MouseEvent) {
    const chessboard = chessBoardRef.current;
    if (activePiece && chessboard) {
      const x = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE));

      const currentPiece = pieces.find((p) => samePosition(p.position, grabPosition));

      if (currentPiece) {
        const validMove = rulesetRef.isValidMove(
          grabPosition,
          { x, y },
          currentPiece.type,
          currentPiece.team,
          pieces
        );

        const isEnpassantMove = rulesetRef.isEnpassantMove(
          grabPosition,
          { x, y },
          currentPiece.type,
          currentPiece.team,
          pieces
        );

        const pawnDirection = currentPiece.team === TeamType.OUR ? 1 : -1;

        if (isEnpassantMove) {
          const updatedPieces = pieces.reduce((results, piece) => {
            if (samePosition(piece.position, grabPosition)) {
              piece.enpassant = false;
              piece.position.x = x;
              piece.position.y = y;
              results.push(piece);
            } else if (!samePosition(piece.position, { x, y: y - pawnDirection })) {
              if (piece.type === PieceType.PAWN) {
                piece.enpassant = false;
              }
              results.push(piece);
            }
            return results;
          }, [] as Piece[]);
          setPieces(updatedPieces);
        } else if (validMove) {
          const updatedPieces = pieces.reduce((results, piece) => {
            if (samePosition(piece.position, grabPosition)) {
              console.log("piece", piece);
              if (Math.abs(grabPosition.y - y) === 2 && currentPiece.type === PieceType.PAWN) {
                piece.enpassant = true;
              } else {
                piece.enpassant = false;
              }
              piece.position.x = x;
              piece.position.y = y;
              let promotionRow = currentPiece.team === TeamType.OUR ? 7 : 0;
              if (y === promotionRow && currentPiece.type === PieceType.PAWN) {
                modalRef.current?.classList.remove("hidden");
                setPromotionPawn(piece);
              }
              results.push(piece);
            } else if (!samePosition(piece.position, { x, y })) {
              results.push(piece);
            }

            return results;
          }, [] as Piece[]);

          setPieces(updatedPieces);
        } else {
          //RESETS THE PIECE POSITION
          activePiece.style.position = "relative";
          activePiece.style.removeProperty("top");
          activePiece.style.removeProperty("left");
        }
      }
      setActivePiece(null);
    }
  }

  function promotePawn(pieceType: PieceType) {
    if (promotionPawn === undefined) {
      return;
    }
    const updatedPieces = pieces.reduce((results, piece) => {
      if (samePosition(piece.position, promotionPawn.position)) {
        const teamType = piece.team === TeamType.OUR ? "w" : "b";
        piece.type = pieceType;
        const pieceString = PieceType[pieceType].toLowerCase();
        piece.image = `assets/images/${pieceString}_${teamType}.png`;
      }
      results.push(piece);
      return results;
    }, [] as Piece[]);

    setPieces(updatedPieces);
    modalRef.current?.classList.add("hidden");
  }

  function promotionTeamType() {
    return promotionPawn?.team === TeamType.OUR ? "w" : "b";
  }

  let board = [];
  for (let j = HORIZONTAL_AXIS.length - 1; j >= 0; j--) {
    for (let i = 0; i < VERTICAL_AXIS.length; i++) {
      let squareColor = (i + j) % 2 === 0 ? "black" : "white";
      let piece = pieces.find((p) => samePosition(p.position, { x: i, y: j }));
      let image = piece ? piece.image : "";

      board.push(
        <Tile key={`${HORIZONTAL_AXIS[i]}${VERTICAL_AXIS[j]}`} color={squareColor} image={image} />
      );
    }
  }

  return (
    <>
      <div id="pawn-promotion-modal" className="hidden" ref={modalRef}>
        <div id="promotion-choices">
          <div className="promotion-choice" id="queen">
            <img
              onClick={() => promotePawn(PieceType.QUEEN)}
              src={`/assets/images/queen_${promotionTeamType()}.png`}
              alt="queen"
            />
          </div>
          <div className="promotion-choice" id="rook">
            <img
              onClick={() => promotePawn(PieceType.ROOK)}
              src={`/assets/images/rook_${promotionTeamType()}.png`}
              alt="rook"
            />
          </div>
          <div className="promotion-choice" id="bishop">
            <img
              onClick={() => promotePawn(PieceType.BISHOP)}
              src={`/assets/images/bishop_${promotionTeamType()}.png`}
              alt="bishop"
            />
          </div>
          <div className="promotion-choice" id="knight">
            <img
              onClick={() => promotePawn(PieceType.KNIGHT)}
              src={`/assets/images/knight_${promotionTeamType()}.png`}
              alt="knight"
            />
          </div>
        </div>
      </div>
      <div
        onMouseDown={(e) => grabPiece(e)}
        onMouseMove={(e) => movePiece(e)}
        onMouseUp={(e) => dropPiece(e)}
        id="chessboard"
        ref={chessBoardRef}
      >
        {board}
      </div>
    </>
  );
};

export default ChessBoard;
