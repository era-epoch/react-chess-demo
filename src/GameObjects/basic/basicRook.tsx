import { faChessRook, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GameState } from '../../state/slices/game/slice';
import { Piece, PlayerColour, Orientation, PieceIdentifier, PieceType, PieceOrigin, Move, MoveFlag } from '../../types';
import { GamePiece, registerGamePiece } from '../gamePiece';
import { filterMoves, genPID } from '../gameUtil';
import {
  standardOnDeathF,
  standardOnCaptureF,
  standardOnMovedF,
  standardOnTurnStartF,
  standardOnTurnEndF,
} from '../standardFunctions';

export const BasicRook = (): Piece => {
  const piece: Piece = {
    owner: PlayerColour.neutral,
    nMoves: 0,
    orientation: Orientation.neutral,
    statuses: [],
    identifier: PieceIdentifier.basicRook,
    type: PieceType.rook,
    origin: PieceOrigin.basic,
    id: genPID(),
    name: 'Rook',
  };
  return piece;
};

export const basicRookMoveF = (
  piece: Piece,
  row: number,
  col: number,
  state: GameState,
  checkKing: boolean = true,
): Move[] => {
  const board = state.board;
  let moves: Move[] = [];
  let i = 1;
  while (row + i < board.length && board[row + i][col].piece.type === PieceType.empty) {
    moves.push({ row: row + i, col: col, oRow: row, oCol: col, flags: [] });
    i++;
  }
  if (row + i < board.length && board[row + i][col].piece.owner !== piece.owner) {
    moves.push({ row: row + i, col: col, flags: [MoveFlag.KILL], oRow: row, oCol: col });
  }
  i = 1;
  while (row - i >= 0 && board[row - i][col].piece.type === PieceType.empty) {
    moves.push({ row: row - i, col: col, oRow: row, oCol: col, flags: [] });
    i++;
  }
  if (row - i >= 0 && board[row - i][col].piece.owner !== piece.owner) {
    moves.push({ row: row - i, col: col, flags: [MoveFlag.KILL], oRow: row, oCol: col });
  }
  i = 1;
  while (col + i < board[0].length && board[row][col + i].piece.type === PieceType.empty) {
    moves.push({ row: row, col: col + i, oRow: row, oCol: col, flags: [] });
    i++;
  }
  if (col + i < board[0].length && board[row][col + i].piece.owner !== piece.owner) {
    moves.push({ row: row, col: col + i, flags: [MoveFlag.KILL], oRow: row, oCol: col });
  }
  i = 1;
  while (col - i >= 0 && board[row][col - i].piece.type === PieceType.empty) {
    moves.push({ row: row, col: col - i, oRow: row, oCol: col, flags: [] });
    i++;
  }
  if (col - i >= 0 && board[row][col - i].piece.owner !== piece.owner) {
    moves.push({ row: row, col: col - i, flags: [MoveFlag.KILL], oRow: row, oCol: col });
  }
  return filterMoves(piece, row, col, state, moves, checkKing);
};

export const RookDetail = (): JSX.Element => {
  return (
    <div className="detail text-detail-basic">
      <div>
        <FontAwesomeIcon icon={faCircleInfo} className="detail-icon" />
        <span className="detail-title">Rook: </span>
        <span className="detail-info">
          A rook can move any number of squares along a rank or file, but cannot leap over other pieces.
        </span>
      </div>
    </div>
  );
};

const BasicRookGamePiece: GamePiece = {
  identifier: PieceIdentifier.basicRook,
  moveF: basicRookMoveF,
  onDeathF: standardOnDeathF,
  onCaptureF: standardOnCaptureF,
  onMovedF: standardOnMovedF,
  onTurnStartF: standardOnTurnStartF,
  onTurnEndF: standardOnTurnEndF,
  details: [RookDetail],
  icon: faChessRook,
};

registerGamePiece(BasicRookGamePiece);
