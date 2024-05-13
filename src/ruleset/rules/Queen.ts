import { Position, TeamType } from "../../Constants";
import { Piece } from "../../InitialBoardState";
import { bishopMovementLogic } from "./Bishop";
import { rookMovementLogic } from "./Rook";

export const queenMovementLogic = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  if (rookMovementLogic(initialPosition, desiredPosition, boardState)) {
    return true;
  } else if (bishopMovementLogic(initialPosition, desiredPosition, team, boardState)) {
    return true;
  }
  return false;
};
