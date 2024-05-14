import { Position, TeamType } from "../../Constants";
import { Piece } from "../../InitialBoardState";
import { tileIsOccupied, tileIsOccupiedByOpponent } from "./Helper";
import { samePosition } from "../../Constants";

export const pawnMovementLogic = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  const specialRow = team === TeamType.OUR ? 1 : 6;
  const pawnDirection = team === TeamType.OUR ? 1 : -1;

  if (
    initialPosition.x === desiredPosition.x &&
    initialPosition.y === specialRow &&
    desiredPosition.y - initialPosition.y === 2 * pawnDirection
  ) {
    if (
      !tileIsOccupied(desiredPosition, boardState) &&
      !tileIsOccupied({ x: desiredPosition.x, y: desiredPosition.y - pawnDirection }, boardState)
    ) {
      return true;
    }
  } else if (
    initialPosition.x === desiredPosition.x &&
    desiredPosition.y - initialPosition.y === pawnDirection
  ) {
    if (!tileIsOccupied(desiredPosition, boardState)) {
      return true;
    }
  }
  // Pawn Capture Logic
  else if (
    desiredPosition.x - initialPosition.x === -1 &&
    desiredPosition.y - initialPosition.y === pawnDirection
  ) {
    if (tileIsOccupiedByOpponent(desiredPosition, boardState, team)) {
      return true;
    }
  } else if (
    desiredPosition.x - initialPosition.x === 1 &&
    desiredPosition.y - initialPosition.y === pawnDirection
  ) {
    if (tileIsOccupiedByOpponent(desiredPosition, boardState, team)) {
      return true;
    }
  }
  return false;
};

export const getPossiblePawnMoves = (pawn: Piece, boardState: Piece[]): Position[] => {
  const possibleMoves: Position[] = [];

  const specialRow = pawn.team === TeamType.OUR ? 1 : 6;
  const pawnDirection = pawn.team === TeamType.OUR ? 1 : -1;

  if (!tileIsOccupied({ x: pawn.position.x, y: pawn.position.y + pawnDirection }, boardState)) {
    possibleMoves.push({ x: pawn.position.x, y: pawn.position.y + pawnDirection });

    if (
      pawn.position.y === specialRow &&
      !tileIsOccupied({ x: pawn.position.x, y: pawn.position.y + pawnDirection * 2 }, boardState)
    ) {
      possibleMoves.push({ x: pawn.position.x, y: pawn.position.y + pawnDirection * 2 });
    }
  }

  return possibleMoves;
};
