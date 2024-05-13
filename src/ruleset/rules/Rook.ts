import { Position, TeamType } from "../../Constants";
import { Piece } from "../../InitialBoardState";
import { tileIsOccupied } from "./Helper";

export const rookMovementLogic = (
  initialPosition: Position,
  desiredPosition: Position,
  boardState: Piece[]
): boolean => {
  if (desiredPosition.x === initialPosition.x) {
    for (
      let i = Math.min(desiredPosition.y, initialPosition.y) + 1;
      i < Math.max(desiredPosition.y, initialPosition.y);
      i++
    ) {
      let passedPosition: Position = {
        x: initialPosition.x,
        y: i,
      };
      if (tileIsOccupied(passedPosition, boardState)) {
        return false;
      }
    }
    return true;
  } else if (desiredPosition.y === initialPosition.y) {
    for (
      let i = Math.min(desiredPosition.x, initialPosition.x) + 1;
      i < Math.max(desiredPosition.x, initialPosition.x);
      i++
    ) {
      let passedPosition: Position = {
        x: i,
        y: initialPosition.y,
      };
      if (tileIsOccupied(passedPosition, boardState)) {
        return false;
      }
    }
    return true;
  }
  return false;
};
