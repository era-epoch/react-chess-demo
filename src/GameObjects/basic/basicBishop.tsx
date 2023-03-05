import { faChessBishop, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GameState } from '../../state/slices/game/slice';
import { Piece, PlayerColour, Orientation, PieceType, PieceIdentifier, PieceOrigin, Move, MoveFlag } from '../../types';
import { GamePiece, registerGamePiece } from '../gamePiece';
import { filterMoves, genPID } from '../gameUtil';
import {
  standardOnDeathF,
  standardOnCaptureF,
  standardOnMovedF,
  standardOnTurnStartF,
  standardOnTurnEndF,
} from '../standardFunctions';

export const BasicBishop = (): Piece => {
  const piece: Piece = {
    owner: PlayerColour.neutral,
    nMoves: 0,
    orientation: Orientation.neutral,
    statuses: [],
    type: PieceType.bishop,
    identifier: PieceIdentifier.basicBishop,
    origin: PieceOrigin.basic,
    id: genPID(),
    name: 'Bishop',
  };
  return piece;
};

export const basicBishopMoveF = (
  piece: Piece,
  row: number,
  col: number,
  state: GameState,
  checkKing: boolean = true,
): Move[] => {
  const board = state.board;
  let moves: Move[] = [];
  let i = 1;
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

export const BishopDetail = (): JSX.Element => {
  return (
    <div className="detail text-detail-basic">
      <div>
        <FontAwesomeIcon icon={faCircleInfo} className="detail-icon" />
        <span className="detail-title">Bishop: </span>
        <span className="detail-info">
          A bishop can move any number of squares diagonally, but cannot leap over other pieces.
        </span>
      </div>
    </div>
  );
};

const BasicBishopGamePiece: GamePiece = {
  identifier: PieceIdentifier.basicBishop,
  moveF: basicBishopMoveF,
  onDeathF: standardOnDeathF,
  onCaptureF: standardOnCaptureF,
  onMovedF: standardOnMovedF,
  onTurnStartF: standardOnTurnStartF,
  onTurnEndF: standardOnTurnEndF,
  details: [BishopDetail],
  icon: faChessBishop,
};

registerGamePiece(BasicBishopGamePiece);
