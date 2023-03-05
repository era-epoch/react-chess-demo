import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Graveyard,
  Move,
  MoveFlag,
  Piece,
  PieceIdentifier,
  PieceOrigin,
  PieceType,
  PlayerColour,
  ResolutionEvent,
  ResolutionEventType,
  SquareContents,
  SquareStatus,
  UserInfo,
} from '../../../types';
import {
  capturePieceAtLocation,
  movePiece,
  denoteMove,
  spawnNewRunes,
  handleEndOfTurn,
  clearAOEHighlights,
} from './helpers';
import emptyBoard from '../../../GameObjects/boards/emptyBoard';
import { ChatItem } from '../ui/slice';
import { getMoveF } from '../../../GameObjects/gamePiece';
import { getAbilityF, getAbilityHoverF, getAbilitySelectF } from '../../../GameObjects/ability';
import { getCurrentPlayer, isPlayersTurn } from '../../../util';

export interface GameState {
  board: SquareContents[][];
  turn: number;
  selectedRow: number | null;
  selectedCol: number | null;
  graveyards: Graveyard[];
  lightRunes: number;
  darkRunes: number;
  winner: PlayerColour | null; // null = not finished, PLayer.neutral = Draw
  creatorColour: PlayerColour | null;
  timedGame: boolean;
  gameTime: number;
  turnTimeBack: number;
  moveHistory: ChatItem[];
  lightRuneSpawns: number;
  darkRuneSpawns: number;
  runeDuration: number;
  runeSpawnTurn: number;
  activeAbility: string;
  abilityActivatedFlag: boolean;
  postTurnResolutionQueue: ResolutionEvent[];
}

const initialGameState: GameState = {
  board: emptyBoard,
  turn: 0,
  selectedRow: null,
  selectedCol: null,
  graveyards: [
    { player: PlayerColour.light, contents: [] },
    { player: PlayerColour.dark, contents: [] },
  ],
  lightRunes: 0,
  darkRunes: 0,
  winner: null,
  creatorColour: null,
  timedGame: false,
  gameTime: 10,
  turnTimeBack: 1,
  moveHistory: [],
  lightRuneSpawns: 0,
  darkRuneSpawns: 0,
  runeDuration: 0,
  runeSpawnTurn: 0,
  activeAbility: '',
  abilityActivatedFlag: false,
  postTurnResolutionQueue: [],
};

// Reducer
const gameSlice = createSlice({
  name: 'game',
  initialState: initialGameState,
  reducers: {
    fullGameStateUpdate: (state: GameState, action: PayloadAction<GameState>) => {
      state.board = action.payload.board;
      state.graveyards = action.payload.graveyards;
      // state.selectedCol = action.payload.selectedCol;
      // state.selectedRow = action.payload.selectedRow;
      state.turn = action.payload.turn;
      state.lightRunes = action.payload.lightRunes;
      state.darkRunes = action.payload.darkRunes;
      state.winner = action.payload.winner;
      state.creatorColour = action.payload.creatorColour;
      state.timedGame = action.payload.timedGame;
      state.gameTime = action.payload.gameTime;
      state.turnTimeBack = action.payload.turnTimeBack;
      state.moveHistory = action.payload.moveHistory;
      state.lightRuneSpawns = action.payload.lightRuneSpawns;
      state.darkRuneSpawns = action.payload.darkRuneSpawns;
      state.runeDuration = action.payload.runeDuration;
      state.runeSpawnTurn = action.payload.runeSpawnTurn;
      // state.activeAbility = action.payload.activeAbility;
    },
    setUpGame: (state: GameState) => {
      if (state.runeSpawnTurn === 0) {
        spawnNewRunes(state);
      }
    },
    makeMove: (state: GameState, action: PayloadAction<{ row: number; col: number }>) => {
      if (state.selectedRow === null || state.selectedCol === null) return;
      const pieceToMove = state.board[state.selectedRow][state.selectedCol].piece;
      const moveFunction = getMoveF(pieceToMove.identifier);
      if (!moveFunction) return;
      const move = moveFunction(pieceToMove, state.selectedRow, state.selectedCol, state, true).find(
        (move: Move) => move.row === action.payload.row && move.col === action.payload.col,
      );
      if (!pieceToMove || !move) return;
      if (state.board[move.row][move.col].piece.type !== PieceType.empty) {
        capturePieceAtLocation(state, move.row, move.col, pieceToMove);
      }
      // ENTERING & EFFECTS
      movePiece(state, pieceToMove, move);
      // Write an algebraic representation of the move to the history
      // denoteMove(state, pieceToMove, move);

      // Unless halted by some effect that requires resolution, end the turn
      if (state.postTurnResolutionQueue.length === 0) {
        handleEndOfTurn(state, pieceToMove.owner);
      }
    },
    selectSquare: (state: GameState, action: PayloadAction<{ row: number; col: number; player: UserInfo }>) => {
      const row = action.payload.row;
      const col = action.payload.col;
      const selectedSameSquare = state.selectedRow === row && state.selectedCol === col;
      const movesToHighlight: Move[] = [];
      if (state.board[row][col].piece.owner === action.payload.player.colour) {
        const moveFunction = getMoveF(state.board[row][col].piece.identifier);
        if (moveFunction) movesToHighlight.push(...moveFunction(state.board[row][col].piece, row, col, state, true));
      }
      for (let i = 0; i < state.board.length; i++) {
        for (let j = 0; j < state.board[i].length; j++) {
          let match = false;
          let castle = false;
          let kill = false;
          let ept = false;
          for (const move of movesToHighlight) {
            if (move.row === i && move.col === j) {
              match = true;
              if (move.flags.includes(MoveFlag.CSTL)) {
                castle = true;
              }
              if (move.flags.includes(MoveFlag.KILL)) {
                kill = true;
              }
              break;
            }
          }
          if (match && !selectedSameSquare) {
            if (castle) {
              state.board[i][j].squareStatuses.push(SquareStatus.HLC);
            } else if (kill) {
              state.board[i][j].squareStatuses.push(SquareStatus.HLK);
            } else if (ept) {
              state.board[i][j].squareStatuses.push(SquareStatus.HLK);
            } else {
              state.board[i][j].squareStatuses.push(SquareStatus.HL);
            }
          } else {
            state.board[i][j].squareStatuses = state.board[i][j].squareStatuses.filter((s) => s !== SquareStatus.HL);
            state.board[i][j].squareStatuses = state.board[i][j].squareStatuses.filter((s) => s !== SquareStatus.HLC);
            state.board[i][j].squareStatuses = state.board[i][j].squareStatuses.filter((s) => s !== SquareStatus.HLK);
          }
          state.board[i][j].squareStatuses = state.board[i][j].squareStatuses.filter((s) => s !== SquareStatus.SEL);
        }
      }
      if (!selectedSameSquare) state.board[row][col].squareStatuses.push(SquareStatus.SEL);
      if (!selectedSameSquare) {
        state.selectedRow = row;
        state.selectedCol = col;
      } else {
        state.selectedRow = null;
        state.selectedCol = null;
      }
    },
    promotePiece: (state: GameState, action: PayloadAction<{ res: ResolutionEvent; new: PieceIdentifier }>) => {
      // TODO: This Better
      if (action.payload.res.type !== ResolutionEventType.PawnPromotion) return;
      let piece: Piece | undefined = undefined;
      for (let i = 0; i < state.board.length; i++) {
        for (let j = 0; j < state.board[i].length; j++) {
          if (state.board[i][j].piece.id === action.payload.res.source?.id) {
            piece = state.board[i][j].piece;
          }
        }
      }
      if (!piece) return;
      switch (action.payload.new) {
        case PieceIdentifier.basicQueen:
          piece.identifier = PieceIdentifier.basicQueen;
          piece.origin = PieceOrigin.basic;
          piece.type = PieceType.queen;
          piece.name = 'Queen';
          break;
        case PieceIdentifier.basicRook:
          piece.identifier = PieceIdentifier.basicRook;
          piece.origin = PieceOrigin.basic;
          piece.type = PieceType.rook;
          piece.name = 'Rook';
          break;
        case PieceIdentifier.basicBishop:
          piece.identifier = PieceIdentifier.basicBishop;
          piece.origin = PieceOrigin.basic;
          piece.type = PieceType.bishop;
          piece.name = 'Bishop';
          break;
        case PieceIdentifier.basicKnight:
          piece.identifier = PieceIdentifier.basicKnight;
          piece.origin = PieceOrigin.basic;
          piece.type = PieceType.knight;
          piece.name = 'Knight';
          break;
      }
      // Resolve Promotion
      state.postTurnResolutionQueue.shift();
    },
    resetSelection: (state: GameState) => {
      state.selectedRow = null;
      state.selectedCol = null;
    },
    updateActiveAbility: (state: GameState, action: PayloadAction<string>) => {
      state.activeAbility = action.payload;
      state.abilityActivatedFlag = false;
      const selectF = getAbilitySelectF(action.payload);
      if (selectF && state.selectedRow && state.selectedCol) {
        const source = state.board[state.selectedRow][state.selectedCol].piece;
        selectF(source, state);
      }
    },
    hoverActiveAbility: (state: GameState) => {
      const hoverF = getAbilityHoverF(state.activeAbility);
      if (hoverF && state.selectedRow && state.selectedCol) {
        const source = state.board[state.selectedRow][state.selectedCol].piece;
        hoverF(source, state);
      }
    },
    hoverAbility: (state: GameState, action: PayloadAction<string>) => {
      const hoverF = getAbilityHoverF(action.payload);
      if (hoverF && state.selectedRow && state.selectedCol) {
        const source = state.board[state.selectedRow][state.selectedCol].piece;
        hoverF(source, state);
      }
    },
    tryActivateAbility: (state: GameState, action: PayloadAction<{ row: number; col: number }>) => {
      const abilityF = getAbilityF(state.activeAbility);
      if (abilityF && state.selectedRow && state.selectedCol) {
        const source = state.board[state.selectedRow][state.selectedCol].piece;
        abilityF(source, action.payload.row, action.payload.col, state);
      }
    },
    endTurnDirect: (state: GameState) => {
      if (state.postTurnResolutionQueue.length !== 0) return;
      // Post EP cleanup
      for (let i = 0; i < state.board.length; i++) {
        for (let j = 0; j < state.board[i].length; j++) {
          state.board[i][j].squareStatuses = state.board[i][j].squareStatuses.filter((s) => s !== SquareStatus.EPV);
          state.board[i][j].enPassantOrigin = null;
        }
      }
      console.log('ending turn');
      handleEndOfTurn(state, getCurrentPlayer(state.turn));
    },
    clearAOE: (state: GameState) => {
      clearAOEHighlights(state);
    },
  },
});
export default gameSlice.reducer;
export const {
  makeMove,
  selectSquare,
  fullGameStateUpdate,
  setUpGame,
  hoverActiveAbility,
  hoverAbility,
  updateActiveAbility,
  tryActivateAbility,
  resetSelection,
  endTurnDirect,
  clearAOE,
  promotePiece,
} = gameSlice.actions;
