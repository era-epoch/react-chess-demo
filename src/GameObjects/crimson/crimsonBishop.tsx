import { faChessBishop, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GameState } from '../../state/slices/game/slice';
import { Piece, PlayerColour, Orientation, PieceType, PieceIdentifier, PieceOrigin, Move, MoveFlag } from '../../types';
import { BishopDetail } from '../basic/basicBishop';
import { GamePiece, GamePieceDetailProps, registerGamePiece } from '../gamePiece';
import { filterMoves, genPID } from '../gameUtil';
import {
  standardOnDeathF,
  standardOnCaptureF,
  standardOnMovedF,
  standardOnTurnStartF,
  standardOnTurnEndF,
} from '../standardFunctions';

export const CrimsonBishop = (): Piece => {
  const piece: Piece = {
    owner: PlayerColour.neutral,
    nMoves: 0,
    orientation: Orientation.neutral,
    statuses: [],
    type: PieceType.bishop,
    identifier: PieceIdentifier.crimsonBishop,
    origin: PieceOrigin.crimson,
    id: genPID(),
    name: 'Vampire',
  };
  return piece;
};

const crimsonBishopMoveF = (
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
  if (row + i < board.length && col + i < board[0].length) {
    moves.push({ row: row + i, col: col + i, flags: [MoveFlag.KILL], oRow: row, oCol: col });
  }
  i = 1;
  while (row + i < board.length && col - i >= 0 && board[row + i][col - i].piece.type === PieceType.empty) {
    moves.push({ row: row + i, col: col - i, oRow: row, oCol: col, flags: [] });
    i++;
  }
  if (row + i < board.length && col - i >= 0) {
    moves.push({ row: row + i, col: col - i, flags: [MoveFlag.KILL], oRow: row, oCol: col });
  }
  i = 1;
  while (row - i >= 0 && col - i >= 0 && board[row - i][col - i].piece.type === PieceType.empty) {
    moves.push({ row: row - i, col: col - i, oRow: row, oCol: col, flags: [] });
    i++;
  }
  if (row - i >= 0 && col - i >= 0) {
    moves.push({ row: row - i, col: col - i, flags: [MoveFlag.KILL], oRow: row, oCol: col });
  }
  i = 1;
  while (row - i >= 0 && col + i < board[0].length && board[row - i][col + i].piece.type === PieceType.empty) {
    moves.push({ row: row - i, col: col + i, oRow: row, oCol: col, flags: [] });
    i++;
  }
  if (row - i >= 0 && col + i < board[0].length) {
    moves.push({ row: row - i, col: col + i, flags: [MoveFlag.KILL], oRow: row, oCol: col });
  }
  return filterMoves(piece, row, col, state, moves, checkKing);
};

export const CrimsonBishopDetail = (props: GamePieceDetailProps): JSX.Element => {
  return (
    <div className="detail text-detail">
      <div>
        <FontAwesomeIcon icon={faStar} className="detail-icon" />
        <span className="detail-title">Cannibalize: </span>
        <span className="detail-info">This piece can capture friendly pieces.</span>
      </div>
    </div>
  );
};

const CrimsonBishopGamePiece: GamePiece = {
  identifier: PieceIdentifier.crimsonBishop,
  moveF: crimsonBishopMoveF,
  onDeathF: standardOnDeathF,
  onCaptureF: standardOnCaptureF,
  onMovedF: standardOnMovedF,
  onTurnStartF: standardOnTurnStartF,
  onTurnEndF: standardOnTurnEndF,
  details: [CrimsonBishopDetail, BishopDetail],
  icon: faChessBishop,
};

registerGamePiece(CrimsonBishopGamePiece);
