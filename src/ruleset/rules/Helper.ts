import { Position, TeamType } from "../../Constants";
import { Piece } from "../../InitialBoardState";
import { samePosition } from "../../Constants";

export const tileIsEmptyOrOccupiedByOpponent = (
  position: Position,
  boardState: Piece[],
  team: TeamType
) => {
  return (
    !tileIsOccupied(position, boardState) || tileIsOccupiedByOpponent(position, boardState, team)
  );
};

export const tileIsOccupied = (position: Position, boardState: Piece[]): boolean => {
  const piece = boardState.find((p) => samePosition(p.position, position));
  if (piece) {
    return true;
  } else {
    return false;
  }
};

export const tileIsOccupiedByOpponent = (
  position: Position,
  boardState: Piece[],
  team: TeamType
): boolean => {
  const piece = boardState.find((p) => samePosition(p.position, position) && p.team !== team);
  if (piece && piece.team !== team) {
    return true;
  } else {
    return false;
  }
};
