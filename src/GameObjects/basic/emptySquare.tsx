import { GameState } from '../../state/slices/game/slice';
import { Piece, PlayerColour, PieceIdentifier, PieceOrigin, Orientation, PieceType, Move } from '../../types';
import { GamePiece, registerGamePiece } from '../gamePiece';
import { genPID } from '../gameUtil';

export const EmptySquare = (): Piece => {
  const piece: Piece = {
    owner: PlayerColour.neutral,
    identifier: PieceIdentifier.empty,
    origin: PieceOrigin.basic,
    nMoves: 0,
    orientation: Orientation.neutral,
    statuses: [],
    type: PieceType.empty,
    id: genPID(),
    name: '',
  };
  return piece;
};

const emptyMoveF = (piece: Piece, row: number, col: number, state: GameState, checkKing: boolean = true): Move[] => {
  return [];
};

const EmptyGamePiece: GamePiece = {
  identifier: PieceIdentifier.empty,
  moveF: emptyMoveF,
  onDeathF: () => {},
  onCaptureF: () => {},
  onMovedF: () => {},
  onTurnStartF: () => {},
  onTurnEndF: () => {},
  details: [],
  icon: null,
};

registerGamePiece(EmptyGamePiece);
