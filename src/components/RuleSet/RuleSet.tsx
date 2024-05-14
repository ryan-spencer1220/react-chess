import Chessboard from "../ChessBoard/ChessBoard";
import { Position } from "../../Constants";

export default function RuleSet() {
  function getPossibleMoves(): Position[] {
    return [];
  }

  function playMove() {
    return;
  }

  return (
    <>
      <Chessboard getPossibleMoves={getPossibleMoves} playMove={playMove} />
    </>
  );
}
