import "./ChessBoard.css";
import Tile from "../Tile/Tile";
import { useState, useRef } from "react";
import Ruleset from "../../ruleset/ruleset";

const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];

export interface Piece {
  image: string;
  x: number;
  y: number;
  type: PieceType;
  team: TeamType;
}

export enum PieceType {
  PAWN,
  ROOK,
  KNIGHT,
  BISHOP,
  QUEEN,
  KING,
}

export enum TeamType {
  OPPONENT,
  OUR,
}

const initialBoardState: Piece[] = [];

for (let p = 0; p < 2; p++) {
  const teamType = p === 0 ? TeamType.OPPONENT : TeamType.OUR;
  const type = teamType === TeamType.OPPONENT ? "b" : "w";
  const y = teamType === TeamType.OPPONENT ? 7 : 0;

  initialBoardState.push({
    image: `assets/images/rook_${type}.png`,
    x: 0,
    y,
    type: PieceType.ROOK,
    team: teamType,
  });
  initialBoardState.push({
    image: `assets/images/rook_${type}.png`,
    x: 7,
    y,
    type: PieceType.ROOK,
    team: teamType,
  });
  initialBoardState.push({
    image: `assets/images/knight_${type}.png`,
    x: 1,
    y,
    type: PieceType.KNIGHT,
    team: teamType,
  });
  initialBoardState.push({
    image: `assets/images/knight_${type}.png`,
    x: 6,
    y,
    type: PieceType.KNIGHT,
    team: teamType,
  });
  initialBoardState.push({
    image: `assets/images/bishop_${type}.png`,
    x: 2,
    y,
    type: PieceType.BISHOP,
    team: teamType,
  });
  initialBoardState.push({
    image: `assets/images/bishop_${type}.png`,
    x: 5,
    y,
    type: PieceType.BISHOP,
    team: teamType,
  });
  initialBoardState.push({
    image: `assets/images/queen_${type}.png`,
    x: 3,
    y,
    type: PieceType.QUEEN,
    team: teamType,
  });
  initialBoardState.push({
    image: `assets/images/king_${type}.png`,
    x: 4,
    y,
    type: PieceType.KING,
    team: teamType,
  });
}

for (let i = 0; i < 8; i++) {
  initialBoardState.push({
    image: "assets/images/pawn_b.png",
    x: i,
    y: 6,
    type: PieceType.PAWN,
    team: TeamType.OPPONENT,
  });
}

for (let i = 0; i < 8; i++) {
  initialBoardState.push({
    image: "assets/images/pawn_w.png",
    x: i,
    y: 1,
    type: PieceType.PAWN,
    team: TeamType.OUR,
  });
}

const ChessBoard = () => {
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const [gridX, setGridX] = useState<number>(0);
  const [gridY, setGridY] = useState<number>(0);
  const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
  const chessBoardRef = useRef<HTMLDivElement>(null);
  const rulesetRef = new Ruleset();

  function grabPiece(e: React.MouseEvent) {
    const element = e.target as HTMLElement;
    const chessBoard = chessBoardRef.current;

    if (element.classList.contains("chess-piece") && chessBoard) {
      setGridX(Math.floor((e.clientX - chessBoard.offsetLeft) / 100));
      setGridY(
        Math.abs(Math.ceil((e.clientY - chessBoard.offsetTop - 800) / 100))
      );

      const x = e.clientX - 50;
      const y = e.clientY - 50;
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
      const x = Math.floor((e.clientX - chessboard.offsetLeft) / 100);
      const y = Math.abs(
        Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100)
      );

      const currentPiece = pieces.find((p) => p.x === gridX && p.y === gridY);
      const attackedPiece = pieces.find((p) => p.x === x && p.y === y);

      if (currentPiece) {
        const validMove = rulesetRef.isValidMove(
          gridX,
          gridY,
          x,
          y,
          currentPiece.type,
          currentPiece.team,
          pieces
        );

        if (validMove) {
          //UPDATES THE PIECE POSITION
          //AND IF A PIECE IS ATTACKED, REMOVES IT
          const updatedPieces = pieces.reduce((results, piece) => {
            if (piece.x === gridX && piece.y === gridY) {
              piece.x = x;
              piece.y = y;
              results.push(piece);
            } else if (!(piece.x === x && piece.y === y)) {
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

  let board = [];
  for (let j = horizontalAxis.length - 1; j >= 0; j--) {
    for (let i = 0; i < verticalAxis.length; i++) {
      let squareColor = (i + j) % 2 === 0 ? "black" : "white";
      let image = "";

      pieces.forEach((piece) => {
        if (piece.x === i && piece.y === j) {
          image = piece.image;
        }
      });
      board.push(
        <Tile
          key={`${horizontalAxis[i]}${verticalAxis[j]}`}
          color={squareColor}
          image={image}
        />
      );
    }
  }

  return (
    <div
      onMouseDown={(e) => grabPiece(e)}
      onMouseMove={(e) => movePiece(e)}
      onMouseUp={(e) => dropPiece(e)}
      id="chessboard"
      ref={chessBoardRef}
    >
      {board}
    </div>
  );
};

export default ChessBoard;
