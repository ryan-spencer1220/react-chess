import "./ChessBoard.css";
import Tile from "../Tile/Tile";
import { useState, useRef } from "react";
import Ruleset from "../../ruleset/ruleset";

const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];

interface Piece {
  image: string;
  x: number;
  y: number;
  type: PieceType;
}

export enum PieceType {
  PAWN,
  ROOK,
  KNIGHT,
  BISHOP,
  QUEEN,
  KING,
}

const initialBoardState: Piece[] = [];

for (let i = 0; i < 8; i++) {
  initialBoardState.push({
    image: "assets/images/pawn_w.png",
    x: i,
    y: 1,
    type: PieceType.PAWN,
  });
  initialBoardState.push({
    image: "assets/images/pawn_b.png",
    x: i,
    y: 6,
    type: PieceType.PAWN,
  });
}

for (let i = 0; i < 8; i++) {
  const type = i % 2 === 0 ? "b" : "w";
  const y = i % 2 === 0 ? 7 : 0;

  initialBoardState.push({
    image: `assets/images/rook_${type}.png`,
    x: 0,
    y,
    type: PieceType.ROOK,
  });
  initialBoardState.push({
    image: `assets/images/rook_${type}.png`,
    x: 7,
    y,
    type: PieceType.ROOK,
  });
  initialBoardState.push({
    image: `assets/images/knight_${type}.png`,
    x: 1,
    y,
    type: PieceType.KNIGHT,
  });
  initialBoardState.push({
    image: `assets/images/knight_${type}.png`,
    x: 6,
    y,
    type: PieceType.KNIGHT,
  });
  initialBoardState.push({
    image: `assets/images/bishop_${type}.png`,
    x: 2,
    y,
    type: PieceType.BISHOP,
  });
  initialBoardState.push({
    image: `assets/images/bishop_${type}.png`,
    x: 5,
    y,
    type: PieceType.BISHOP,
  });
  initialBoardState.push({
    image: `assets/images/queen_${type}.png`,
    x: 3,
    y,
    type: PieceType.QUEEN,
  });
  initialBoardState.push({
    image: `assets/images/king_${type}.png`,
    x: 4,
    y,
    type: PieceType.KING,
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
    const chessBoard = chessBoardRef.current;
    if (activePiece && chessBoard) {
      const x = Math.floor((e.clientX - chessBoard!.offsetLeft) / 100);
      const y = Math.abs(
        Math.ceil((e.clientY - chessBoard!.offsetTop - 800) / 100)
      );

      setPieces((value) => {
        const pieces = value.map((piece) => {
          if (piece.x === gridX && piece.y === gridY) {
            rulesetRef.invalidMove(gridX, gridY, x, y, piece.type);
            piece.x = x;
            piece.y = y;
          }
          return piece;
        });
        return pieces;
      });
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
