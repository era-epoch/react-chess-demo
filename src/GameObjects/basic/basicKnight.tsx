import { faChessKnight, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
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

export const BasicKnight = (): Piece => {
  const piece: Piece = {
    owner: PlayerColour.neutral,
    nMoves: 0,
    orientation: Orientation.neutral,
    statuses: [],
    type: PieceType.knight,
    identifier: PieceIdentifier.basicKnight,
    origin: PieceOrigin.basic,
    id: genPID(),
    name: 'Knight',
  };
  return piece;
};

export const basicKnightMoveF = (
  piece: Piece,
  row: number,
  col: number,
  state: GameState,
  checkKing: boolean = true,
): Move[] => {
  const board = state.board;
  let moves: Move[] = [];
  const options = [
    [1, 2],
    [1, -2],
    [-1, 2],
    [-1, -2],
    [2, 1],
    [2, -1],
    [-2, 1],
    [-2, -1],
  ];
  for (const option of options) {
    if (
      row + option[0] >= 0 &&
      row + option[0] < board.length &&
      col + option[1] >= 0 &&
      col + option[1] < board[0].length &&
      (board[row + option[0]][col + option[1]].piece.type === PieceType.empty ||
        board[row + option[0]][col + option[1]].piece.owner !== piece.owner)
    ) {
      if (board[row + option[0]][col + option[1]].piece.owner === (piece.owner + 1) % 2) {
        moves.push({
          row: row + option[0],
          col: col + option[1],
          flags: [MoveFlag.KILL],
          oRow: row,
          oCol: col,
        });
      } else {
        moves.push({ row: row + option[0], col: col + option[1], oRow: row, oCol: col, flags: [] });
      }
    }
  }
  return filterMoves(piece, row, col, state, moves, checkKing);
};

export const KnightDetail = (): JSX.Element => {
  return (
    <div className="detail text-detail-basic">
      <div>
        <FontAwesomeIcon icon={faCircleInfo} className="detail-icon" />
        <span className="detail-title">Knight: </span>
        <span className="detail-info">
          A knight moves to any of the closest squares that are not on the same rank, file, or diagonal. (Thus the move
          forms an "L"-shape: two squares vertically and one square horizontally, or two squares horizontally and one
          square vertically.)
        </span>
      </div>
    </div>
  );
};

const BasicKnightGamePiece: GamePiece = {
  identifier: PieceIdentifier.basicKnight,
  moveF: basicKnightMoveF,
  onDeathF: standardOnDeathF,
  onCaptureF: standardOnCaptureF,
  onMovedF: standardOnMovedF,
  onTurnStartF: standardOnTurnStartF,
  onTurnEndF: standardOnTurnEndF,
  details: [KnightDetail],
  icon: faChessKnight,
};

registerGamePiece(BasicKnightGamePiece);
