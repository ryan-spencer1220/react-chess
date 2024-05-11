import { PieceType } from "../components/ChessBoard/ChessBoard";

export default class Ruleset {
  invalidMove(py: number, px: number, x: number, y: number, type: PieceType) {
    console.log("ruleset");
  }
}
