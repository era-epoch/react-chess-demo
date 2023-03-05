import { faChessKing, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GameState } from '../../state/slices/game/slice';
import { Piece, PlayerColour, Orientation, PieceType, PieceIdentifier, PieceOrigin, Move, MoveFlag } from '../../types';
import { GamePiece, registerGamePiece } from '../gamePiece';
import { filterMoves, genPID, validateMoveWRTKing } from '../gameUtil';
import {
  standardOnDeathF,
  standardOnCaptureF,
  standardOnMovedF,
  standardOnTurnStartF,
  standardOnTurnEndF,
} from '../standardFunctions';

export const BasicKing = (): Piece => {
  const piece: Piece = {
    owner: PlayerColour.neutral,
    nMoves: 0,
    orientation: Orientation.neutral,
    statuses: [],
    type: PieceType.king,
    identifier: PieceIdentifier.basicKing,
    origin: PieceOrigin.basic,
    id: genPID(),
    name: 'King',
  };
  return piece;
};

export const basicKingMoveF = (
  piece: Piece,
  row: number,
  col: number,
  state: GameState,
  checkKing: boolean = true,
): Move[] => {
  const board = state.board;
  let moves: Move[] = [];
  const options = [
    [1, 0],
    [-1, 0],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
    [0, 1],
    [0, -1],
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
  if (piece.nMoves === 0) {
    let blockedRight = false;
    let i = 1;
    while (col + i < board[0].length && board[row][col + i].piece.type !== PieceType.rook) {
      if (board[row][col + i].piece.type !== PieceType.empty) {
        blockedRight = true;
      }
      i++;
    }
    if (
      !blockedRight &&
      col + i < board[0].length &&
      board[row][col + i].piece.type === PieceType.rook &&
      board[row][col + i].piece.owner === piece.owner &&
      board[row][col + i].piece.nMoves === 0 &&
      (checkKing
        ? validateMoveWRTKing(piece, row, col, state, { row: row, col: col + 1, oRow: row, oCol: col, flags: [] })
        : true)
    ) {
      moves.push({ row: row, col: col + 2, flags: [MoveFlag.CSTL], oRow: row, oCol: col });
    }
    let blockedLeft = false;
    i = 1;
    while (col - i >= 0 && board[row][col - i].piece.type !== PieceType.rook) {
      if (board[row][col - i].piece.type !== PieceType.empty) {
        blockedLeft = true;
      }
      i++;
    }
    if (
      !blockedLeft &&
      col - i >= 0 &&
      board[row][col - i].piece.type === PieceType.rook &&
      board[row][col - i].piece.owner === piece.owner &&
      board[row][col - i].piece.nMoves === 0 &&
      (checkKing
        ? validateMoveWRTKing(piece, row, col, state, { row: row, col: col - 1, oRow: row, oCol: col, flags: [] })
        : true)
    ) {
      moves.push({ row: row, col: col - 2, flags: [MoveFlag.CSTL], oRow: row, oCol: col });
    }
  }
  return filterMoves(piece, row, col, state, moves, checkKing);
};

export const KingDetail = (): JSX.Element => {
  return (
    <div className="detail text-detail-basic">
      <div>
        <FontAwesomeIcon icon={faCircleInfo} className="detail-icon" />
        <span className="detail-title">King: </span>
        <span className="detail-info">
          The king moves one square in any direction. The king is the most valuable piece — attacks on the king must be
          immediately countered, and if this is impossible, immediate loss of the game ensues.
        </span>
      </div>
    </div>
  );
};

export const CastlingDetail = (): JSX.Element => {
  return (
    <div className="detail text-detail-basic">
      <div>
        <FontAwesomeIcon icon={faCircleInfo} className="detail-icon" />
        <span className="detail-title">Castling: </span>
        <span className="detail-info">
          Once per game, each king can make a move known as castling. Castling consists of moving the king two squares
          toward a rook of the same color on the same rank, and then placing the rook on the square that the king
          crossed. Castling is permissible if the following conditions are met:
        </span>
      </div>
      <div className="detail-list">
        <div>1. Neither the king nor the rook has previously moved during the game.</div>
        <div>2. There are no pieces between the king and the rook.</div>
        <div>
          3. The king is not in check and does not pass through or land on any square attacked by an enemy piece.
        </div>
      </div>
      <span>Castling is still permitted if the rook is under attack, or if the rook crosses an attacked square.</span>
    </div>
  );
};

const BasicKingGamePiece: GamePiece = {
  identifier: PieceIdentifier.basicKing,
  moveF: basicKingMoveF,
  onDeathF: standardOnDeathF,
  onCaptureF: standardOnCaptureF,
  onMovedF: standardOnMovedF,
  onTurnStartF: standardOnTurnStartF,
  onTurnEndF: standardOnTurnEndF,
  details: [KingDetail, CastlingDetail],
  icon: faChessKing,
};

registerGamePiece(BasicKingGamePiece);
