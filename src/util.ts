import { wsEmitMove } from './socketMiddleware';
import { GameState } from './state/slices/game/slice';
import { OnlineGameStatus, swapLocalPlayer } from './state/slices/ui/slice';
import { store } from './state/store';
import { Piece, PlayerColour, UserInfo } from './types';

export const isPlayersTurn = (turn: number, player: UserInfo): boolean => {
  if (turn % 2 === 0) {
    return player.colour === PlayerColour.light;
  } else {
    return player.colour === PlayerColour.dark;
  }
};

export const getCurrentPlayer = (turn: number): PlayerColour => {
  if (turn % 2 === 0) {
    return PlayerColour.light;
  } else {
    return PlayerColour.dark;
  }
};

export const getPieceLocation = (piece: Piece, state: GameState): { row: number; col: number } => {
  for (let i = 0; i < state.board.length; i++) {
    for (let j = 0; j < state.board[i].length; j++) {
      if (state.board[i][j].piece.id === piece.id) {
        return { row: i, col: j };
      }
    }
  }
  return { row: -1, col: -1 };
};
