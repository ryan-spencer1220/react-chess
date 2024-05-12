import {
  PieceType,
  TeamType,
  Piece,
} from "../components/ChessBoard/ChessBoard";

export default class Ruleset {
  tileIsOccupied(x: number, y: number, boardState: Piece[]): boolean {
    const piece = boardState.find((p) => p.x === x && p.y === y);
    if (piece) {
      return true;
    } else {
      return false;
    }
  }

  TileIsOccupiedByOpponent(
    x: number,
    y: number,
    boardState: Piece[],
    team: TeamType
  ): boolean {
    const piece = boardState.find((p) => p.x === x && p.y === y);
    if (piece && piece.team !== team) {
      return true;
    } else {
      return false;
    }
  }

  isValidMove(
    px: number,
    py: number,
    x: number,
    y: number,
    type: PieceType,
    team: TeamType,
    boardState: Piece[]
  ) {
    console.log("Referee is checking the move...");
    console.log(`Previous location: (${px},${py})`);
    console.log(`Current location: (${x},${y})`);
    console.log(`Piece type: ${type}`);
    console.log(`Team: ${team}`);

    // Pawn Movement Logic
    if (type === PieceType.PAWN) {
      const specialRow = team === TeamType.OUR ? 1 : 6;
      const pawnDirection = team === TeamType.OUR ? 1 : -1;

      if (px === x && py === specialRow && y - py === 2 * pawnDirection) {
        if (
          !this.tileIsOccupied(x, y, boardState) &&
          !this.tileIsOccupied(x, y - pawnDirection, boardState)
        ) {
          return true;
        }
      } else if (px === x && y - py === pawnDirection) {
        if (!this.tileIsOccupied(x, y, boardState)) {
          return true;
        }
      }
      // Pawn Capture Logic
      else if (x - px === -1 && y - py === pawnDirection) {
        if (this.TileIsOccupiedByOpponent(x, y, boardState, team)) {
          return true;
        }
      } else if (x - px === 1 && y - py === pawnDirection) {
        if (this.TileIsOccupiedByOpponent(x, y, boardState, team)) {
          return true;
        }
      }
    }
    return false;
  }
}
