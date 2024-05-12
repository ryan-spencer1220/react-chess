import { PieceType, TeamType, Position, samePosition } from "../Constants";
import { Piece } from "../InitialBoardState";

export default class Ruleset {
  tileIsEmptyOrOccupiedByOpponent(
    position: Position,
    boardState: Piece[],
    team: TeamType
  ) {
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

  tileIsOccupiedByOpponent(
    position: Position,
    boardState: Piece[],
    team: TeamType
  ): boolean {
    const piece = boardState.find(
      (p) => samePosition(p.position, position) && p.team !== team
    );
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

  isValidMove(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType,
    team: TeamType,
    boardState: Piece[]
  ) {
    // Pawn Movement Logic
    if (type === PieceType.PAWN) {
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
    } else if (type === PieceType.KNIGHT) {
      for (let i = -1; i < 2; i += 2) {
        for (let j = -1; j < 2; j += 2) {
          //TOP AND BOTTOM SIDE MOVEMENT
          if (desiredPosition.y - initialPosition.y === 2 * i) {
            if (desiredPosition.x - initialPosition.x === j) {
              if (
                this.tileIsEmptyOrOccupiedByOpponent(
                  desiredPosition,
                  boardState,
                  team
                )
              ) {
                return true;
              }
            }
          }

          //RIGHT AND LEFT SIDE MOVEMENT
          if (desiredPosition.x - initialPosition.x === 2 * i) {
            if (desiredPosition.y - initialPosition.y === j) {
              if (
                this.tileIsEmptyOrOccupiedByOpponent(
                  desiredPosition,
                  boardState,
                  team
                )
              ) {
                return true;
              }
            }
          }
        }
      }
    } else if (type === PieceType.BISHOP) {
      //Movement and attack logic for the bishop

      for (let i = 1; i < 8; i++) {
        //Up right movement
        if (
          desiredPosition.x > initialPosition.x &&
          desiredPosition.y > initialPosition.y
        ) {
          let passedPosition: Position = {
            x: initialPosition.x + i,
            y: initialPosition.y + i,
          };
          if (this.tileIsOccupied(passedPosition, boardState)) {
            console.log("Illegal move");
            break;
          }
        }

        if (
          desiredPosition.x - initialPosition.x === i &&
          desiredPosition.y - initialPosition.y === i
        ) {
          return true;
        }

        //Bottom right movement
        if (
          desiredPosition.x > initialPosition.x &&
          desiredPosition.y < initialPosition.y
        ) {
          let passedPosition: Position = {
            x: initialPosition.x + i,
            y: initialPosition.y - i,
          };
          if (this.tileIsOccupied(passedPosition, boardState)) {
            console.log("Illegal move");
            break;
          }
        }

        if (
          desiredPosition.x - initialPosition.x === i &&
          desiredPosition.y - initialPosition.y === -i
        ) {
          return true;
        }

        //Bottom left movement
        if (
          desiredPosition.x < initialPosition.x &&
          desiredPosition.y < initialPosition.y
        ) {
          let passedPosition: Position = {
            x: initialPosition.x - i,
            y: initialPosition.y - i,
          };
          if (this.tileIsOccupied(passedPosition, boardState)) {
            console.log("Illegal move");
            break;
          }
        }

        if (
          desiredPosition.x - initialPosition.x === -i &&
          desiredPosition.y - initialPosition.y === -i
        ) {
          return true;
        }

        //Top left movement
        if (
          desiredPosition.x < initialPosition.x &&
          desiredPosition.y > initialPosition.y
        ) {
          let passedPosition: Position = {
            x: initialPosition.x - i,
            y: initialPosition.y + i,
          };
          if (this.tileIsOccupied(passedPosition, boardState)) {
            console.log("Illegal move");
            break;
          }
        }

        if (
          desiredPosition.x - initialPosition.x === -i &&
          desiredPosition.y - initialPosition.y === i
        ) {
          return true;
        }
      }
    }
    return false;
  }
}
