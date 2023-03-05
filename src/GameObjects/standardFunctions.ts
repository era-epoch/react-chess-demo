import { capturePieceAtLocation } from '../state/slices/game/helpers';
import { GameState } from '../state/slices/game/slice';
import {
  AbilityHoverFunction,
  AbilitySelectFunction,
  CaptureFunction,
  DeathFunction,
  Graveyard,
  LifecycleFunction,
  Piece,
  PieceStatus,
  PieceType,
  PlayerColour,
  SquareStatus,
} from '../types';
import { getCurrentPlayer } from '../util';
import { EmptySquare } from './basic/emptySquare';

export const standardOnDeathF: DeathFunction = (
  piece: Piece,
  row: number,
  col: number,
  state: GameState,
  capturer?: Piece,
): void => {
  if (capturer) {
    const graveyard = state.graveyards.find((g: Graveyard) => g.player === capturer.owner);
    if (state.board[row][col].piece.type !== PieceType.empty) {
      graveyard?.contents.push(piece);
    }
  }
  // TODO: Neutral graveyard
  state.board[row][col].piece = EmptySquare();
  // Get rid of trailing en-passant capture:
  if (piece.type === PieceType.pawn) {
    for (let i = 0; i < state.board.length; i++) {
      for (let j = 0; j < state.board[i].length; j++) {
        if (state.board[i][j].enPassantOrigin?.id === piece.id) {
          state.board[i][j].squareStatuses = state.board[i][j].squareStatuses.filter((s) => s !== SquareStatus.EPV);
          state.board[i][j].enPassantOrigin = null;
        }
      }
    }
  }
};

export const standardOnCaptureF: CaptureFunction = (
  piece: Piece,
  row: number,
  col: number,
  state: GameState,
  target: Piece,
) => {
  return;
};

export const standardOnMovedF: LifecycleFunction = (piece: Piece, row: number, col: number, state: GameState): void => {
  piece.nMoves++;
  state.selectedRow = row;
  state.selectedCol = col;
};

export const standardOnTurnStartF: LifecycleFunction = (
  piece: Piece,
  row: number,
  col: number,
  state: GameState,
): void => {
  // Collect runes from squares with pieces on them
  if (state.board[row][col].squareStatuses.includes(SquareStatus.RUNE)) {
    if (piece.owner === PlayerColour.light) {
      state.lightRunes++;
    }
    if (piece.owner === PlayerColour.dark) {
      state.darkRunes++;
    }
  }
};

export const standardOnTurnEndF: LifecycleFunction = (
  piece: Piece,
  row: number,
  col: number,
  state: GameState,
): void => {
  // Check to see if the piece dies from poison
  let poisonStacks = 0;
  for (let i = 0; i < piece.statuses.length; i++) {
    if (piece.statuses[i] === PieceStatus.PSN) {
      poisonStacks++;
    }
  }
  // If poison stacks >=3 AND it is this player's turn
  const immune = piece.statuses.includes(PieceStatus.immune);
  if (!immune && poisonStacks >= 3 && piece.owner === getCurrentPlayer(state.turn)) {
    capturePieceAtLocation(state, row, col);
  }
};

export const standardOnRoundEndF: LifecycleFunction = (
  piece: Piece,
  row: number,
  col: number,
  state: GameState,
): void => {
  return;
};

export const standardAbilitySelectF: AbilitySelectFunction = (source: Piece, state: GameState) => {
  return;
};

export const standardAbilityHoverF: AbilityHoverFunction = (source: Piece, state: GameState) => {
  return;
};
