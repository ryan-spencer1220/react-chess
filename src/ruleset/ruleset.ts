import { PieceType, TeamType, Position, samePosition } from "../Constants";
import { Piece } from "../InitialBoardState";

export default class Ruleset {
  tileIsEmptyOrOccupiedByOpponent(position: Position, boardState: Piece[], team: TeamType) {
    return (
      !this.tileIsOccupied(position, boardState) ||
      this.tileIsOccupiedByOpponent(position, boardState, team)
    );
  }

  tileIsOccupied(position: Position, boardState: Piece[]): boolean {
    const piece = boardState.find((p) => samePosition(p.position, position));
    if (piece) {
      return true;
    } else {
      return false;
    }
  }

  tileIsOccupiedByOpponent(position: Position, boardState: Piece[], team: TeamType): boolean {
    const piece = boardState.find((p) => samePosition(p.position, position) && p.team !== team);
    if (piece && piece.team !== team) {
      return true;
    } else {
      return false;
    }
  }

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

  pawnMovementLogic(
    initialPosition: Position,
    desiredPosition: Position,
    team: TeamType,
    boardState: Piece[]
  ): boolean {
    const specialRow = team === TeamType.OUR ? 1 : 6;
    const pawnDirection = team === TeamType.OUR ? 1 : -1;

    if (
      initialPosition.x === desiredPosition.x &&
      initialPosition.y === specialRow &&
      desiredPosition.y - initialPosition.y === 2 * pawnDirection
    ) {
      if (
        !this.tileIsOccupied(desiredPosition, boardState) &&
        !this.tileIsOccupied(
          { x: desiredPosition.x, y: desiredPosition.y - pawnDirection },
          boardState
        )
      ) {
        return true;
      }
    } else if (
      initialPosition.x === desiredPosition.x &&
      desiredPosition.y - initialPosition.y === pawnDirection
    ) {
      if (!this.tileIsOccupied(desiredPosition, boardState)) {
        return true;
      }
    }
    // Pawn Capture Logic
    else if (
      desiredPosition.x - initialPosition.x === -1 &&
      desiredPosition.y - initialPosition.y === pawnDirection
    ) {
      if (this.tileIsOccupiedByOpponent(desiredPosition, boardState, team)) {
        return true;
      }
    } else if (
      desiredPosition.x - initialPosition.x === 1 &&
      desiredPosition.y - initialPosition.y === pawnDirection
    ) {
      if (this.tileIsOccupiedByOpponent(desiredPosition, boardState, team)) {
        return true;
      }
    }
    return false;
  }

  knightMovementLogic(
    initialPosition: Position,
    desiredPosition: Position,
    team: TeamType,
    boardState: Piece[]
  ): boolean {
    for (let i = -1; i < 2; i += 2) {
      for (let j = -1; j < 2; j += 2) {
        //TOP AND BOTTOM SIDE MOVEMENT
        if (desiredPosition.y - initialPosition.y === 2 * i) {
          if (desiredPosition.x - initialPosition.x === j) {
            if (this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)) {
              return true;
            }
          }
        }

        //RIGHT AND LEFT SIDE MOVEMENT
        if (desiredPosition.x - initialPosition.x === 2 * i) {
          if (desiredPosition.y - initialPosition.y === j) {
            if (this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  bishopMovementLogic(
    initialPosition: Position,
    desiredPosition: Position,
    team: TeamType,
    boardState: Piece[]
  ): boolean {
    for (let i = 1; i < 8; i++) {
      //Up right movement
      if (desiredPosition.x > initialPosition.x && desiredPosition.y > initialPosition.y) {
        let passedPosition: Position = {
          x: initialPosition.x + i,
          y: initialPosition.y + i,
        };
        //Check if the tile is the destination tile
        if (passedPosition.x === desiredPosition.x && passedPosition.y === desiredPosition.y) {
          //Dealing with destination tile
          if (this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
            return true;
          }
        } else {
          //Dealing with passing tile
          if (this.tileIsOccupied(passedPosition, boardState)) {
            break;
          }
        }
      }

      //Bottom right movement
      if (desiredPosition.x > initialPosition.x && desiredPosition.y < initialPosition.y) {
        let passedPosition: Position = {
          x: initialPosition.x + i,
          y: initialPosition.y - i,
        };
        //Check if the tile is the destination tile
        if (passedPosition.x === desiredPosition.x && passedPosition.y === desiredPosition.y) {
          //Dealing with destination tile
          if (this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
            return true;
          }
        } else {
          if (this.tileIsOccupied(passedPosition, boardState)) {
            break;
          }
        }
      }

      //Bottom left movement
      if (desiredPosition.x < initialPosition.x && desiredPosition.y < initialPosition.y) {
        let passedPosition: Position = {
          x: initialPosition.x - i,
          y: initialPosition.y - i,
        };
        //Check if the tile is the destination tile
        if (passedPosition.x === desiredPosition.x && passedPosition.y === desiredPosition.y) {
          //Dealing with destination tile
          if (this.tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  rookMovementLogic(
    initialPosition: Position,
    desiredPosition: Position,
    boardState: Piece[]
  ): boolean {
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
        if (this.tileIsOccupied(passedPosition, boardState)) {
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
        if (this.tileIsOccupied(passedPosition, boardState)) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  queenMovementLogic(
    initialPosition: Position,
    desiredPosition: Position,
    team: TeamType,
    boardState: Piece[]
  ): boolean {
    if (this.rookMovementLogic(initialPosition, desiredPosition, boardState)) {
      return true;
    } else if (this.bishopMovementLogic(initialPosition, desiredPosition, team, boardState)) {
      return true;
    }
    return false;
  }

  kingMovementLogic(
    initialPosition: Position,
    desiredPosition: Position,
    team: TeamType,
    boardState: Piece[]
  ): boolean {
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (i === 0 && j === 0) {
          continue;
        }
        if (
          desiredPosition.x === initialPosition.x + i &&
          desiredPosition.y === initialPosition.y + j
        ) {
          if (this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, boardState, team)) {
            return true;
          }
        }
      }
    }
    return false;
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
        validMove = this.pawnMovementLogic(initialPosition, desiredPosition, team, boardState);
        break;
      case PieceType.BISHOP:
        validMove = this.bishopMovementLogic(initialPosition, desiredPosition, team, boardState);
        break;
      case PieceType.KNIGHT:
        validMove = this.knightMovementLogic(initialPosition, desiredPosition, team, boardState);
        break;
      case PieceType.ROOK:
        validMove = this.rookMovementLogic(initialPosition, desiredPosition, boardState);
        break;
      case PieceType.QUEEN:
        validMove = this.queenMovementLogic(initialPosition, desiredPosition, team, boardState);
        break;
      case PieceType.KING:
        validMove = this.kingMovementLogic(initialPosition, desiredPosition, team, boardState);
        break;
    }
    return validMove;
  }
}
