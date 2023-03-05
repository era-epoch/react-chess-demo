import { faChessPawn, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GameState } from '../../state/slices/game/slice';
import { Piece, PlayerColour, PieceIdentifier, PieceOrigin, Orientation, PieceType, Move, MoveFlag } from '../../types';
import { GamePiece, registerGamePiece } from '../gamePiece';
import { filterMoves, genPID } from '../gameUtil';
import {
  standardOnCaptureF,
  standardOnDeathF,
  standardOnMovedF,
  standardOnTurnEndF,
  standardOnTurnStartF,
} from '../standardFunctions';

export const BasicPawn = (): Piece => {
  const piece: Piece = {
    owner: PlayerColour.neutral,
    identifier: PieceIdentifier.basicPawn,
    origin: PieceOrigin.basic,
    nMoves: 0,
    orientation: Orientation.neutral,
    statuses: [],
    type: PieceType.pawn,
    id: genPID(),
    name: 'Pawn',
  };
  return piece;
};

export const basicPawnMoveF = (
  piece: Piece,
  row: number,
  col: number,
  state: GameState,
  checkKing: boolean = true,
): Move[] => {
  const board = state.board;
  let moves: Move[] = [];
  if (piece.orientation === Orientation.bottom) {
    if (board[row - 1][col].piece.type === PieceType.empty) {
      moves.push({ row: row - 1, col: col, oRow: row, oCol: col, flags: [] });
    }
    if (
      piece.nMoves === 0 &&
      board[row - 2][col].piece.type === PieceType.empty &&
      board[row - 1][col].piece.type === PieceType.empty
    ) {
      moves.push({ row: row - 2, col: col, flags: [MoveFlag.EP], oRow: row, oCol: col });
    }
    if (
      board[row - 1][col - 1].piece.owner === (piece.owner + 1) % 2 ||
      (board[row - 1][col - 1].enPassantOrigin !== null &&
        board[row - 1][col - 1].enPassantOrigin?.owner !== piece.owner)
    ) {
      moves.push({ row: row - 1, col: col - 1, flags: [MoveFlag.KILL], oRow: row, oCol: col });
    }
    if (
      board[row - 1][col + 1].piece.owner === (piece.owner + 1) % 2 ||
      (board[row - 1][col + 1].enPassantOrigin !== null &&
        board[row - 1][col + 1].enPassantOrigin?.owner !== piece.owner)
    ) {
      moves.push({ row: row - 1, col: col + 1, flags: [MoveFlag.KILL], oRow: row, oCol: col });
    }
    // Add promotion flag to moves that would result in a pawn promotion
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].row <= 1) {
        moves[i].flags.push(MoveFlag.PROMO);
      }
    }
  } else if (piece.orientation === Orientation.top) {
    if (board[row + 1][col].piece.type === PieceType.empty) {
      moves.push({ row: row + 1, col: col, oRow: row, oCol: col, flags: [] });
    }
    if (
      piece.nMoves === 0 &&
      board[row + 2][col].piece.type === PieceType.empty &&
      board[row + 1][col].piece.type === PieceType.empty
    ) {
      moves.push({ row: row + 2, col: col, flags: [MoveFlag.EP], oRow: row, oCol: col });
    }
    if (
      board[row + 1][col - 1].piece.owner === (piece.owner + 1) % 2 ||
      (board[row + 1][col - 1].enPassantOrigin !== null &&
        board[row + 1][col - 1].enPassantOrigin?.owner !== piece.owner)
    ) {
      moves.push({ row: row + 1, col: col - 1, flags: [MoveFlag.KILL], oRow: row, oCol: col });
    }
    if (
      board[row + 1][col + 1].piece.owner === (piece.owner + 1) % 2 ||
      (board[row + 1][col + 1].enPassantOrigin !== null &&
        board[row + 1][col + 1].enPassantOrigin?.owner !== piece.owner)
    ) {
      moves.push({ row: row + 1, col: col + 1, flags: [MoveFlag.KILL], oRow: row, oCol: col });
    }
    // Add promotion flag to moves that would result in a pawn promotion
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].row >= 8) {
        moves[i].flags.push(MoveFlag.PROMO);
      }
    }
  }
  return filterMoves(piece, row, col, state, moves, checkKing);
};

export const PawnDetail = (): JSX.Element => {
  return (
    <div className="detail text-detail-basic">
      <div>
        <FontAwesomeIcon icon={faCircleInfo} className="detail-icon" />
        <span className="detail-title">Pawn: </span>
        <span className="detail-info">
          A pawn can move forward to the unoccupied square immediately in front of it on the same file, or on its first
          move it can advance two squares along the same file, provided both squares are unoccupied. A pawn can capture
          an opponent's piece on a square diagonally in front of it by moving to that square.
        </span>
      </div>
    </div>
  );
};

export const EnPassantDetail = (): JSX.Element => {
  return (
    <div className="detail text-detail-basic">
      <div>
        <FontAwesomeIcon icon={faCircleInfo} className="detail-icon" />
        <span className="detail-title">En Passant: </span>
        <span className="detail-info">
          When a pawn makes a two-step advance from its starting position and there is an opponent's pawn on a square
          next to the destination square on an adjacent file, then the opponent's pawn can capture it en passant ("in
          passing"), moving to the square the pawn passed over. This can be done only on the turn immediately following
          the enemy pawn's two-square advance
        </span>
      </div>
    </div>
  );
};

export const PromotionDetail = (): JSX.Element => {
  return (
    <div className="detail text-detail-basic">
      <div>
        <FontAwesomeIcon icon={faCircleInfo} className="detail-icon" />
        <span className="detail-title">Promotion: </span>
        <span className="detail-info">
          When a pawn advances to its eighth rank, as part of the move, it is promoted and must be exchanged for the
          player's choice of queen, rook, bishop, or knight of the same color.
        </span>
      </div>
    </div>
  );
};

const BasicPawnGamePiece: GamePiece = {
  identifier: PieceIdentifier.basicPawn,
  moveF: basicPawnMoveF,
  onDeathF: standardOnDeathF,
  onCaptureF: standardOnCaptureF,
  onMovedF: standardOnMovedF,
  onTurnStartF: standardOnTurnStartF,
  onTurnEndF: standardOnTurnEndF,
  details: [PawnDetail, EnPassantDetail, PromotionDetail],
  icon: faChessPawn,
};

registerGamePiece(BasicPawnGamePiece);
