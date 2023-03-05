import { faChessQueen, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GameState } from '../../state/slices/game/slice';
import { Move, MoveFlag, Orientation, Piece, PieceIdentifier, PieceOrigin, PieceType, PlayerColour } from '../../types';
import { GamePiece, registerGamePiece } from '../gamePiece';
import { filterMoves, genPID } from '../gameUtil';
import {
  standardOnDeathF,
  standardOnCaptureF,
  standardOnMovedF,
  standardOnTurnStartF,
  standardOnTurnEndF,
} from '../standardFunctions';

export const BasicQueen = (): Piece => {
  const piece: Piece = {
    owner: PlayerColour.neutral,
    nMoves: 0,
    orientation: Orientation.neutral,
    statuses: [],
    type: PieceType.queen,
    identifier: PieceIdentifier.basicQueen,
    origin: PieceOrigin.basic,
    id: genPID(),
    name: 'Queen',
  };
  return piece;
};

export const basicQueenMoveF = (
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
  i = 1;
  while (
    row + i < board.length &&
    col + i < board[0].length &&
    board[row + i][col + i].piece.type === PieceType.empty
  ) {
    moves.push({ row: row + i, col: col + i, oRow: row, oCol: col, flags: [] });
    i++;
  }
  if (row + i < board.length && col + i < board[0].length && board[row + i][col + i].piece.owner !== piece.owner) {
    moves.push({ row: row + i, col: col + i, flags: [MoveFlag.KILL], oRow: row, oCol: col });
  }
  i = 1;
  while (row + i < board.length && col - i >= 0 && board[row + i][col - i].piece.type === PieceType.empty) {
    moves.push({ row: row + i, col: col - i, oRow: row, oCol: col, flags: [] });
    i++;
  }
  if (row + i < board.length && col - i >= 0 && board[row + i][col - i].piece.owner !== piece.owner) {
    moves.push({ row: row + i, col: col - i, flags: [MoveFlag.KILL], oRow: row, oCol: col });
  }
  i = 1;
  while (row - i >= 0 && col - i >= 0 && board[row - i][col - i].piece.type === PieceType.empty) {
    moves.push({ row: row - i, col: col - i, oRow: row, oCol: col, flags: [] });
    i++;
  }
  if (row - i >= 0 && col - i >= 0 && board[row - i][col - i].piece.owner !== piece.owner) {
    moves.push({ row: row - i, col: col - i, flags: [MoveFlag.KILL], oRow: row, oCol: col });
  }
  i = 1;
  while (row - i >= 0 && col + i < board[0].length && board[row - i][col + i].piece.type === PieceType.empty) {
    moves.push({ row: row - i, col: col + i, oRow: row, oCol: col, flags: [] });
    i++;
  }
  if (row - i >= 0 && col + i < board[0].length && board[row - i][col + i].piece.owner !== piece.owner) {
    moves.push({ row: row - i, col: col + i, flags: [MoveFlag.KILL], oRow: row, oCol: col });
  }
  return filterMoves(piece, row, col, state, moves, checkKing);
};

export const QueenDetail = (): JSX.Element => {
  return (
    <div className="detail text-detail-basic">
      <div>
        <FontAwesomeIcon icon={faCircleInfo} className="detail-icon" />
        <span className="detail-title">Queen: </span>
        <span className="detail-info">
          A queen combines the power of a rook and bishop and can move any number of squares along a rank, file, or
          diagonal, but cannot leap over other pieces.
        </span>
      </div>
    </div>
  );
};

const BasicQueenGamePiece: GamePiece = {
  identifier: PieceIdentifier.basicQueen,
  moveF: basicQueenMoveF,
  onDeathF: standardOnDeathF,
  onCaptureF: standardOnCaptureF,
  onMovedF: standardOnMovedF,
  onTurnStartF: standardOnTurnStartF,
  onTurnEndF: standardOnTurnEndF,
  details: [QueenDetail],
  icon: faChessQueen,
};

registerGamePiece(BasicQueenGamePiece);
