import Chessboard from "../ChessBoard/ChessBoard";
import { Position } from "../../Constants";
import { Piece, initialBoardState } from "../../InitialBoardState";
import { useEffect, useState } from "react";
import { PieceType } from "../../Constants";
import { bishopMovementLogic, getPossibleBishopMoves } from "../../ruleset/rules/Bishop";
import { getPossibleKingMoves, kingMovementLogic } from "../../ruleset/rules/King";
import { getPossibleKnightMoves, knightMovementLogic } from "../../ruleset/rules/Knight";
import { pawnMovementLogic, getPossiblePawnMoves } from "../../ruleset/rules/Pawn";
import { getPossibleQueenMoves, queenMovementLogic } from "../../ruleset/rules/Queen";
import { getPossibleRookMoves, rookMovementLogic } from "../../ruleset/rules/Rook";
import { TeamType, samePosition } from "../../Constants";
import { useRef } from "react";

export default function RuleSet() {
  const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
  const [promotionPawn, setPromotionPawn] = useState<Piece>();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    updatePossibleMoves();
  }, []);

  function updatePossibleMoves() {
    setPieces((currentPieces) => {
      return currentPieces.map((p) => {
        p.possibleMoves = getValidMoves(p, currentPieces);
        return p;
      });
    });
  }

  function playMove(playedPiece: Piece, destination: Position): boolean {
    const validMove = isValidMove(
      playedPiece.position,
      destination,
      playedPiece.type,
      playedPiece.team
    );

    const enPassantMove = isEnPassantMove(
      playedPiece.position,
      destination,
      playedPiece.type,
      playedPiece.team
    );

    const pawnDirection = playedPiece.team === TeamType.OUR ? 1 : -1;

    if (enPassantMove) {
      const updatedPieces = pieces.reduce((results, piece) => {
        if (samePosition(piece.position, playedPiece.position)) {
          piece.enPassant = false;
          piece.position.x = destination.x;
          piece.position.y = destination.y;
          results.push(piece);
        } else if (
          !samePosition(piece.position, { x: destination.x, y: destination.y - pawnDirection })
        ) {
          if (piece.type === PieceType.PAWN) {
            piece.enPassant = false;
          }
          results.push(piece);
        }

        return results;
      }, [] as Piece[]);

      updatePossibleMoves();
      setPieces(updatedPieces);
    } else if (validMove) {
      //UPDATES THE PIECE POSITION
      //AND IF A PIECE IS ATTACKED, REMOVES IT
      const updatedPieces = pieces.reduce((results, piece) => {
        if (samePosition(piece.position, playedPiece.position)) {
          //SPECIAL MOVE
          piece.enPassant =
            Math.abs(playedPiece.position.y - destination.y) === 2 && piece.type === PieceType.PAWN;

          piece.position.x = destination.x;
          piece.position.y = destination.y;

          let promotionRow = piece.team === TeamType.OUR ? 7 : 0;

          if (destination.y === promotionRow && piece.type === PieceType.PAWN) {
            modalRef.current?.classList.remove("hidden");
            setPromotionPawn(piece);
          }
          results.push(piece);
        } else if (!samePosition(piece.position, { x: destination.x, y: destination.y })) {
          if (piece.type === PieceType.PAWN) {
            piece.enPassant = false;
          }
          results.push(piece);
        }

        return results;
      }, [] as Piece[]);

      updatePossibleMoves();
      setPieces(updatedPieces);
    } else {
      return false;
    }
    return true;
  }

  function isEnPassantMove(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType,
    team: TeamType
  ) {
    const pawnDirection = team === TeamType.OUR ? 1 : -1;

    if (type === PieceType.PAWN) {
      if (
        (desiredPosition.x - initialPosition.x === -1 ||
          desiredPosition.x - initialPosition.x === 1) &&
        desiredPosition.y - initialPosition.y === pawnDirection
      ) {
        const piece = pieces.find(
          (p) =>
            p.position.x === desiredPosition.x &&
            p.position.y === desiredPosition.y - pawnDirection &&
            p.enPassant
        );
        if (piece) {
          return true;
        }
      }
    }

    return false;
  }

  //TODO
  //Pawn promotion!
  //Prevent the king from moving into danger!
  //Add castling!
  //Add check!
  //Add checkmate!
  //Add stalemate!
  function isValidMove(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType,
    team: TeamType
  ) {
    let validMove = false;
    switch (type) {
      case PieceType.PAWN:
        validMove = pawnMovementLogic(initialPosition, desiredPosition, team, pieces);
        break;
      case PieceType.KNIGHT:
        validMove = knightMovementLogic(initialPosition, desiredPosition, team, pieces);
        break;
      case PieceType.BISHOP:
        validMove = bishopMovementLogic(initialPosition, desiredPosition, team, pieces);
        break;
      case PieceType.ROOK:
        validMove = rookMovementLogic(initialPosition, desiredPosition, pieces);
        break;
      case PieceType.QUEEN:
        validMove = queenMovementLogic(initialPosition, desiredPosition, team, pieces);
        break;
      case PieceType.KING:
        validMove = kingMovementLogic(initialPosition, desiredPosition, team, pieces);
    }

    return validMove;
  }

  function getValidMoves(piece: Piece, boardState: Piece[]): Position[] {
    switch (piece.type) {
      case PieceType.PAWN:
        return getPossiblePawnMoves(piece, boardState);
      case PieceType.KNIGHT:
        return getPossibleKnightMoves(piece, boardState);
      case PieceType.BISHOP:
        return getPossibleBishopMoves(piece, boardState);
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

  function promotePawn(pieceType: PieceType) {
    if (promotionPawn === undefined) {
      return;
    }

    const updatedPieces = pieces.reduce((results, piece) => {
      if (samePosition(piece.position, promotionPawn.position)) {
        piece.type = pieceType;
        const teamType = piece.team === TeamType.OUR ? "w" : "b";
        let image = "";
        switch (pieceType) {
          case PieceType.ROOK: {
            image = "rook";
            break;
          }
          case PieceType.BISHOP: {
            image = "bishop";
            break;
          }
          case PieceType.KNIGHT: {
            image = "knight";
            break;
          }
          case PieceType.QUEEN: {
            image = "queen";
            break;
          }
        }
        piece.image = `assets/images/${image}_${teamType}.png`;
      }
      results.push(piece);
      return results;
    }, [] as Piece[]);

    updatePossibleMoves();
    setPieces(updatedPieces);

    modalRef.current?.classList.add("hidden");
  }

  function promotionTeamType() {
    return promotionPawn?.team === TeamType.OUR ? "w" : "b";
  }

  return (
    <>
      <div id="pawn-promotion-modal" className="hidden" ref={modalRef}>
        <div className="modal-body">
          <img
            onClick={() => promotePawn(PieceType.ROOK)}
            src={`/assets/images/rook_${promotionTeamType()}.png`}
          />
          <img
            onClick={() => promotePawn(PieceType.BISHOP)}
            src={`/assets/images/bishop_${promotionTeamType()}.png`}
          />
          <img
            onClick={() => promotePawn(PieceType.KNIGHT)}
            src={`/assets/images/knight_${promotionTeamType()}.png`}
          />
          <img
            onClick={() => promotePawn(PieceType.QUEEN)}
            src={`/assets/images/queen_${promotionTeamType()}.png`}
          />
        </div>
      </div>
      <Chessboard playMove={playMove} pieces={pieces} />
    </>
  );
}
