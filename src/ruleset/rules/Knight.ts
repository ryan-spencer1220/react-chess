import { Position, TeamType } from "../../Constants";
import { Piece } from "../../InitialBoardState";
import { tileIsEmptyOrOccupiedByOpponent } from "./Helper";

export const knightMovementLogic = (
  initialPosition: Position,
  desiredPosition: Position,
  team: TeamType,
  boardState: Piece[]
): boolean => {
  for (let i = -1; i < 2; i += 2) {
    for (let j = -1; j < 2; j += 2) {
      //TOP AND BOTTOM SIDE MOVEMENT
      if (desiredPosition.y - initialPosition.y === 2 * i) {
        if (desiredPosition.x - initialPosition.x === j) {
          if (tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)) {
            return true;
          }
        }
      }

      //RIGHT AND LEFT SIDE MOVEMENT
      if (desiredPosition.x - initialPosition.x === 2 * i) {
        if (desiredPosition.y - initialPosition.y === j) {
          if (tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)) {
            return true;
          }
        }
      }
    }
  }
  return false;
};
