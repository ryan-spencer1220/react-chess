import { Position, TeamType } from "../../Constants";
import { Piece } from "../../InitialBoardState";
import { tileIsEmptyOrOccupiedByOpponent } from "./Helper";

export const kingMovementLogic = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      if (i === 0 && j === 0) {
        continue;
      }
      if (
        desiredPosition.x === initialPosition.x + i &&
        desiredPosition.y === initialPosition.y + j
      ) {
        if (tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)) {
          return true;
        }
      }
    }
  }
  return false;
};
