import { PieceType, TeamType, Position } from "../Constants";
import { Piece } from "../InitialBoardState";
import { bishopMovementLogic, getPossibleBishopMoves } from "./rules/Bishop";
import { getPossibleKingMoves, kingMovementLogic } from "./rules/King";
import { getPossibleKnightMoves, knightMovementLogic } from "./rules/Knight";
import { pawnMovementLogic, getPossiblePawnMoves } from "./rules/Pawn";
import { getPossibleQueenMoves, queenMovementLogic } from "./rules/Queen";
import { getPossibleRookMoves, rookMovementLogic } from "./rules/Rook";

export default class Rules {
  isEnpassantMove(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType,
    team: TeamType,
    boardState: Piece[]
  ): boolean {
    const pawnDirection = team === TeamType.OUR ? 1 : -1;

    if (type === PieceType.PAWN) {
      if (
        (desiredPosition.x - initialPosition.x === -1 ||
          desiredPosition.x - initialPosition.x === 1) &&
        desiredPosition.y - initialPosition.y === pawnDirection
      ) {
        const piece = boardState.find(
          (p) =>
            p.position.x === desiredPosition.x &&
            p.position.y === desiredPosition.y - pawnDirection &&
            p.enpassant
        );
        return piece ? true : false;
      }
    }
    return false;
  }

  getValidMoves(piece: Piece, boardState: Piece[]): Position[] {
    switch (piece.type) {
      case PieceType.PAWN:
        return getPossiblePawnMoves(piece, boardState);
      case PieceType.BISHOP:
        return getPossibleBishopMoves(piece, boardState);
      case PieceType.KNIGHT:
        return getPossibleKnightMoves(piece, boardState);
      case PieceType.ROOK:
        return getPossibleRookMoves(piece, boardState);
      case PieceType.QUEEN:
        return getPossibleQueenMoves(piece, boardState);
      case PieceType.KING:
        return getPossibleKingMoves(piece, boardState);
      default:
        return [];
    }
  }

  isValidMove(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType,
    team: TeamType,
    boardState: Piece[]
  ) {
    let validMove = false;
    switch (type) {
      case PieceType.PAWN:
        validMove = pawnMovementLogic(initialPosition, desiredPosition, team, boardState);
        break;
      case PieceType.BISHOP:
        validMove = bishopMovementLogic(initialPosition, desiredPosition, team, boardState);
        break;
      case PieceType.KNIGHT:
        validMove = knightMovementLogic(initialPosition, desiredPosition, team, boardState);
        break;
      case PieceType.ROOK:
        validMove = rookMovementLogic(initialPosition, desiredPosition, boardState);
        break;
      case PieceType.QUEEN:
        validMove = queenMovementLogic(initialPosition, desiredPosition, team, boardState);
        break;
      case PieceType.KING:
        validMove = kingMovementLogic(initialPosition, desiredPosition, team, boardState);
        break;
    }
    return validMove;
  }
}
