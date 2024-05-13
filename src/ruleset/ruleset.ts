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
          //Check if the tile is the destination tile
          if (
            passedPosition.x === desiredPosition.x &&
            passedPosition.y === desiredPosition.y
          ) {
            //Dealing with destination tile
            if (
              this.tileIsEmptyOrOccupiedByOpponent(
                passedPosition,
                boardState,
                team
              )
            ) {
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
        if (
          desiredPosition.x > initialPosition.x &&
          desiredPosition.y < initialPosition.y
        ) {
          let passedPosition: Position = {
            x: initialPosition.x + i,
            y: initialPosition.y - i,
          };
          //Check if the tile is the destination tile
          if (
            passedPosition.x === desiredPosition.x &&
            passedPosition.y === desiredPosition.y
          ) {
            //Dealing with destination tile
            if (
              this.tileIsEmptyOrOccupiedByOpponent(
                passedPosition,
                boardState,
                team
              )
            ) {
              return true;
            }
          } else {
            if (this.tileIsOccupied(passedPosition, boardState)) {
              break;
            }
          }
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
          //Check if the tile is the destination tile
          if (
            passedPosition.x === desiredPosition.x &&
            passedPosition.y === desiredPosition.y
          ) {
            //Dealing with destination tile
            if (
              this.tileIsEmptyOrOccupiedByOpponent(
                passedPosition,
                boardState,
                team
              )
            ) {
              return true;
            }
          } else {
            if (this.tileIsOccupied(passedPosition, boardState)) {
              break;
            }
          }
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
          //Check if the tile is the destination tile
          if (
            passedPosition.x === desiredPosition.x &&
            passedPosition.y === desiredPosition.y
          ) {
            //Dealing with destination tile
            if (
              this.tileIsEmptyOrOccupiedByOpponent(
                passedPosition,
                boardState,
                team
              )
            ) {
              return true;
            }
          } else {
            if (this.tileIsOccupied(passedPosition, boardState)) {
              break;
            }
          }
        }
      }
    } else if (type === PieceType.ROOK) {
      console.log("Rook movement");
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
    }
    return false;
  }
}
