import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  setUpSquare,
  EmptySquare,
  RookBasic,
  KnightBasic,
  BishopBasic,
  QueenBasic,
  KingBasic,
  PawnBasic,
} from '../../../GameObjects/piecesBasic';
import { Graveyard, Move, MoveFlag, Player, SquareContents, SquareStatus } from '../../../types';
import { removePieceAtLocation, movePiece, isGameover, handleGameover, selectedPieceCanMove } from './helpers';

const initialBoard: SquareContents[][] = [
  [
    setUpSquare(EmptySquare(), 2, 2, false),
    setUpSquare(EmptySquare(), 2, 2, false),
    setUpSquare(EmptySquare(), 2, 2, false),
    setUpSquare(EmptySquare(), 2, 2, false),
    setUpSquare(EmptySquare(), 2, 2, false),
    setUpSquare(EmptySquare(), 2, 2, false),
    setUpSquare(EmptySquare(), 2, 2, false),
    setUpSquare(EmptySquare(), 2, 2, false),
    setUpSquare(EmptySquare(), 2, 2, false),
    setUpSquare(EmptySquare(), 2, 2, false),
  ],
  [
    setUpSquare(EmptySquare(), 2, 2, false),
    setUpSquare(RookBasic(), 1, 0, true),
    setUpSquare(KnightBasic(), 1, 0, true),
    setUpSquare(BishopBasic(), 1, 0, true),
    setUpSquare(QueenBasic(), 1, 0, true),
    setUpSquare(KingBasic(), 1, 0, true),
    setUpSquare(BishopBasic(), 1, 0, true),
    setUpSquare(KnightBasic(), 1, 0, true),
    setUpSquare(RookBasic(), 1, 0, true),
    setUpSquare(EmptySquare(), 2, 2, false),
  ],
  [
    setUpSquare(EmptySquare(), 2, 2, false),
    setUpSquare(PawnBasic(), 1, 0, true),
    setUpSquare(PawnBasic(), 1, 0, true),
    setUpSquare(PawnBasic(), 1, 0, true),
    setUpSquare(PawnBasic(), 1, 0, true),
    setUpSquare(PawnBasic(), 1, 0, true),
    setUpSquare(PawnBasic(), 1, 0, true),
    setUpSquare(PawnBasic(), 1, 0, true),
    setUpSquare(PawnBasic(), 1, 0, true),
    setUpSquare(EmptySquare(), 2, 2, false),
  ],
  [
    setUpSquare(EmptySquare(), 2, 2, false),
    setUpSquare(EmptySquare(), 2, 2, true),
    setUpSquare(EmptySquare(), 2, 2, true),
    setUpSquare(EmptySquare(), 2, 2, true),
    setUpSquare(EmptySquare(), 2, 2, true),
    setUpSquare(EmptySquare(), 2, 2, true),
    setUpSquare(EmptySquare(), 2, 2, true),
    setUpSquare(EmptySquare(), 2, 2, true),
    setUpSquare(EmptySquare(), 2, 2, true),
    setUpSquare(EmptySquare(), 2, 2, false),
  ],
  [
    setUpSquare(EmptySquare(), 2, 2, false),
    setUpSquare(EmptySquare(), 2, 2, true),
    setUpSquare(EmptySquare(), 2, 2, true),
    setUpSquare(EmptySquare(), 2, 2, true),
    setUpSquare(EmptySquare(), 2, 2, true),
    setUpSquare(EmptySquare(), 2, 2, true),
    setUpSquare(EmptySquare(), 2, 2, true),
    setUpSquare(EmptySquare(), 2, 2, true),
    setUpSquare(EmptySquare(), 2, 2, true),
    setUpSquare(EmptySquare(), 2, 2, false),
  ],
  [
    setUpSquare(EmptySquare(), 2, 2, false),
    setUpSquare(EmptySquare(), 2, 2, true),
    setUpSquare(EmptySquare(), 2, 2, true),
    setUpSquare(EmptySquare(), 2, 2, true),
    setUpSquare(EmptySquare(), 2, 2, true),
    setUpSquare(EmptySquare(), 2, 2, true),
    setUpSquare(EmptySquare(), 2, 2, true),
    setUpSquare(EmptySquare(), 2, 2, true),
    setUpSquare(EmptySquare(), 2, 2, true),
    setUpSquare(EmptySquare(), 2, 2, false),
  ],
  [
    setUpSquare(EmptySquare(), 2, 2, false),
    setUpSquare(EmptySquare(), 2, 2, true),
    setUpSquare(EmptySquare(), 2, 2, true),
    setUpSquare(EmptySquare(), 2, 2, true),
    setUpSquare(EmptySquare(), 2, 2, true),
    setUpSquare(EmptySquare(), 2, 2, true),
    setUpSquare(EmptySquare(), 2, 2, true),
    setUpSquare(EmptySquare(), 2, 2, true),
    setUpSquare(EmptySquare(), 2, 2, true),
    setUpSquare(EmptySquare(), 2, 2, false),
  ],
  [
    setUpSquare(EmptySquare(), 2, 2, false),
    setUpSquare(PawnBasic(), 0, 1, true),
    setUpSquare(PawnBasic(), 0, 1, true),
    setUpSquare(PawnBasic(), 0, 1, true),
    setUpSquare(PawnBasic(), 0, 1, true),
    setUpSquare(PawnBasic(), 0, 1, true),
    setUpSquare(PawnBasic(), 0, 1, true),
    setUpSquare(PawnBasic(), 0, 1, true),
    setUpSquare(PawnBasic(), 0, 1, true),
    setUpSquare(EmptySquare(), 2, 2, false),
  ],
  [
    setUpSquare(EmptySquare(), 2, 2, false),
    setUpSquare(RookBasic(), 0, 1, true),
    setUpSquare(KnightBasic(), 0, 1, true),
    setUpSquare(BishopBasic(), 0, 1, true),
    setUpSquare(QueenBasic(), 0, 1, true),
    setUpSquare(KingBasic(), 0, 1, true),
    setUpSquare(BishopBasic(), 0, 1, true),
    setUpSquare(KnightBasic(), 0, 1, true),
    setUpSquare(RookBasic(), 0, 1, true),
    setUpSquare(EmptySquare(), 2, 2, false),
  ],
  [
    setUpSquare(EmptySquare(), 2, 2, false),
    setUpSquare(EmptySquare(), 2, 2, false),
    setUpSquare(EmptySquare(), 2, 2, false),
    setUpSquare(EmptySquare(), 2, 2, false),
    setUpSquare(EmptySquare(), 2, 2, false),
    setUpSquare(EmptySquare(), 2, 2, false),
    setUpSquare(EmptySquare(), 2, 2, false),
    setUpSquare(EmptySquare(), 2, 2, false),
    setUpSquare(EmptySquare(), 2, 2, false),
    setUpSquare(EmptySquare(), 2, 2, false),
  ],
];

export interface GameState {
  board: SquareContents[][];
  turn: number;
  selectedRow: number | null;
  selectedCol: number | null;
  graveyards: Graveyard[];
  completed: boolean;
  winner: Player | null; // null = not finished, PLayer.neutral = Draw
}

// interface GameRecord {
//   states: SquareContents[][][],
// }

const initialGameState: GameState = {
  board: initialBoard,
  turn: 0,
  selectedRow: null,
  selectedCol: null,
  graveyards: [
    { player: Player.light, contents: [] },
    { player: Player.dark, contents: [] },
  ],
  completed: false,
  winner: null,
};

// Reducer
const gameSlice = createSlice({
  name: 'game',
  initialState: initialGameState,
  reducers: {
    makeMove: (state: GameState, action: PayloadAction<{ row: number; col: number }>) => {
      if (state.selectedRow === null || state.selectedCol === null) return;
      const pieceToMove = state.board[state.selectedRow][state.selectedCol].piece;
      const move = pieceToMove
        .moveF(pieceToMove, state.selectedRow, state.selectedCol, state, true)
        .find((move: Move) => move.row === action.payload.row && move.col === action.payload.col);
      if (!pieceToMove || !move) return;
      const originSquare = state.board[state.selectedRow][state.selectedCol];
      // PRE-MOVE
      // LEAVING
      originSquare.piece = EmptySquare();
      // REMOVING TARGET
      removePieceAtLocation(state, move.row, move.col);
      // ENTERING & EFFECTS
      movePiece(state, pieceToMove, move);
      // CLEANUP
      let i = 0;
      for (const row of state.board) {
        let j = 0;
        for (const cell of row) {
          // TODO: Transfer cleanup to postMove function
          state.board[i][j].squareStatuses.delete(SquareStatus.HL);
          state.board[i][j].squareStatuses.delete(SquareStatus.SEL);
          state.board[i][j].squareStatuses.delete(SquareStatus.HLC);
          state.board[i][j].squareStatuses.delete(SquareStatus.HLK);
          j++;
        }
        i++;
      }
      //.onTurnEnd()
      // if () .onRoundEnd()
      if (isGameover(state, pieceToMove.owner)) handleGameover(state, pieceToMove.owner);
      state.turn++;
    },
    selectSquare: (state: GameState, action: PayloadAction<{ row: number; col: number }>) => {
      const row = action.payload.row;
      const col = action.payload.col;
      const movesToHighlight: Move[] = [];
      if (selectedPieceCanMove(state, row, col)) {
        movesToHighlight.push(...state.board[row][col].piece.moveF(state.board[row][col].piece, row, col, state, true));
      }
      const selectedSameSquare = state.selectedRow === row && state.selectedCol === col;
      let i = 0;
      for (const row of state.board) {
        let j = 0;
        for (const cell of row) {
          let match = false;
          let castle = false;
          let kill = false;
          let ept = false;
          for (const move of movesToHighlight) {
            if (move.row === i && move.col === j) {
              match = true;
              if (move.flags?.has(MoveFlag.CSTL)) {
                castle = true;
              }
              if (move.flags?.has(MoveFlag.KILL)) {
                kill = true;
              }
              break;
            }
          }
          if (match && !selectedSameSquare) {
            if (castle) {
              state.board[i][j].squareStatuses.add(SquareStatus.HLC);
            } else if (kill) {
              state.board[i][j].squareStatuses.add(SquareStatus.HLK);
            } else if (ept) {
              state.board[i][j].squareStatuses.add(SquareStatus.HLK);
            } else {
              state.board[i][j].squareStatuses.add(SquareStatus.HL);
            }
          } else {
            state.board[i][j].squareStatuses.delete(SquareStatus.HL);
            state.board[i][j].squareStatuses.delete(SquareStatus.HLC);
            state.board[i][j].squareStatuses.delete(SquareStatus.HLK);
          }
          state.board[i][j].squareStatuses.delete(SquareStatus.SEL);
          j++;
        }
        i++;
      }
      if (!selectedSameSquare) state.board[row][col].squareStatuses.add(SquareStatus.SEL);
      if (!selectedSameSquare) {
        state.selectedRow = row;
        state.selectedCol = col;
      } else {
        state.selectedRow = null;
        state.selectedCol = null;
      }
    },
  },
});
export default gameSlice.reducer;
export const { makeMove, selectSquare } = gameSlice.actions;
