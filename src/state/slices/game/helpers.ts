import { EmptySquare } from '../../../GameObjects/basic/emptySquare';
import {
  getCaptureF,
  getDeathF,
  getMoveF,
  getOnMovedF,
  getOnTurnEndF,
  getOnTurnStartF,
} from '../../../GameObjects/gamePiece';
import { kingInCheck } from '../../../GameObjects/gameUtil';
import {
  Piece,
  Move,
  MoveFlag,
  SquareStatus,
  PieceType,
  PlayerColour,
  typeAlgebriacNotationMap,
  ResolutionEventType,
} from '../../../types';
import { ChatItem, ChatItemType } from '../ui/slice';
import { GameState } from './slice';

export const colNumToLetterMap = new Map<number, string>([
  [0, 's'],
  [1, 'a'],
  [2, 'b'],
  [3, 'c'],
  [4, 'd'],
  [5, 'e'],
  [6, 'f'],
  [7, 'g'],
  [8, 'h'],
  [9, 'i'],
]);

// Pushes an algebraic notation representation of a move to the game history
export const denoteMove = (state: GameState, piece: Piece, move: Move) => {
  let notation = '';
  // TODO: kingside vs queenside castle
  if (move.flags.includes(MoveFlag.CSTL)) {
    notation += 'O-O';
  } else {
    notation += typeAlgebriacNotationMap.get(piece.type);
    // Is this a capture?
    if (move.flags.includes(MoveFlag.KILL)) notation += 'x';
    const col = colNumToLetterMap.get(move.col);
    const row = (9 - move.row).toString();
    notation += col + row;
    // Does this move put the other king in Check?
    if (kingInCheck(state, (piece.owner + 1) % 2)) {
      notation += '+';
    }
  }
  // TODO: disambiguate pieces if necessary
  state.moveHistory.push({
    content: notation,
    time: new Date(),
    origin: '',
    type: ChatItemType.GAME,
  } as ChatItem);
};

export const movePiece = (gameState: GameState, piece: Piece, move: Move) => {
  // Castle Logic
  if (move.flags.includes(MoveFlag.CSTL)) {
    let kingPos = 0;
    // Look for the selected king *in this row*
    for (let i = 0; i < gameState.board[move.row].length; i++) {
      if (gameState.board[move.row][i].squareStatuses.includes(SquareStatus.SEL)) {
        kingPos = i;
        break;
      }
    }
    if (move.col < kingPos) {
      // Castling to the left
      let i = 1;
      while (gameState.board[move.row][move.col - i].piece.type !== PieceType.rook) {
        i++;
      }
      gameState.board[move.row][move.col + 1].piece = gameState.board[move.row][move.col - i].piece;
      gameState.board[move.row][move.col - i].piece = EmptySquare();
    } else {
      // Castling to the right
      let i = 1;
      while (gameState.board[move.row][move.col + i].piece.type !== PieceType.rook) {
        i++;
      }
      gameState.board[move.row][move.col - 1].piece = gameState.board[move.row][move.col + i].piece;
      gameState.board[move.row][move.col + i].piece = EmptySquare();
    }
  }

  // En passant capture logic
  if (
    gameState.board[move.row][move.col].squareStatuses.includes(SquareStatus.EPV) &&
    gameState.board[move.row][move.col].enPassantOrigin?.owner !== piece.owner &&
    piece.type === PieceType.pawn
  ) {
    for (let i = 0; i < gameState.board.length; i++) {
      for (let j = 0; j < gameState.board[i].length; j++) {
        if (gameState.board[i][j].piece.id === gameState.board[move.row][move.col].enPassantOrigin?.id) {
          capturePieceAtLocation(gameState, i, j, piece);
        }
      }
    }
  }

  // Post EP cleanup
  for (let i = 0; i < gameState.board.length; i++) {
    for (let j = 0; j < gameState.board[i].length; j++) {
      gameState.board[i][j].squareStatuses = gameState.board[i][j].squareStatuses.filter((s) => s !== SquareStatus.EPV);
      gameState.board[i][j].enPassantOrigin = null;
    }
  }

  // En passant logic
  if (move.flags.includes(MoveFlag.EP)) {
    let pawnPos = 0;
    // Look for the selected pawn *in this column*
    for (let i = 0; i < gameState.board.length; i++) {
      if (gameState.board[i][move.col].squareStatuses.includes(SquareStatus.SEL)) {
        pawnPos = i;
        break;
      }
    }
    if (pawnPos < move.row) {
      // En passant square is above
      gameState.board[move.row - 1][move.col].squareStatuses.push(SquareStatus.EPV);
      gameState.board[move.row - 1][move.col].enPassantOrigin = piece;
    } else {
      // En passant square is below
      gameState.board[move.row + 1][move.col].squareStatuses.push(SquareStatus.EPV);
      gameState.board[move.row + 1][move.col].enPassantOrigin = piece;
    }
  }
  if (gameState.selectedRow === null || gameState.selectedCol === null) return;
  const originSquare = gameState.board[gameState.selectedRow][gameState.selectedCol];
  originSquare.piece = EmptySquare();

  gameState.board[move.row][move.col].piece = piece;
  const movedF = getOnMovedF(piece.identifier);
  if (movedF) movedF(piece, move.row, move.col, gameState);

  // Promotion logic
  if (move.flags.includes(MoveFlag.PROMO)) {
    gameState.postTurnResolutionQueue.push({ type: ResolutionEventType.PawnPromotion, source: piece });
  }
};

export const capturePieceAtLocation = (gameState: GameState, row: number, col: number, capturer?: Piece) => {
  const target = gameState.board[row][col].piece;
  const deathF = getDeathF(target.identifier);
  if (capturer) {
    const captureF = getCaptureF(capturer.identifier);
    if (captureF) captureF(capturer, row, col, gameState, target);
    if (deathF) deathF(target, row, col, gameState, capturer);
  } else {
    if (deathF) deathF(target, row, col, gameState);
  }
};

export const startTurn = (state: GameState) => {
  if (
    state.turn === state.runeSpawnTurn ||
    (state.turn > state.runeSpawnTurn && (state.turn - state.runeSpawnTurn) % state.runeDuration === 0)
  ) {
    spawnNewRunes(state);
  }
  for (let i = 0; i < state.board.length; i++) {
    for (let j = 0; j < state.board[i].length; j++) {
      const f = getOnTurnStartF(state.board[i][j].piece.identifier);
      if (f) f(state.board[i][j].piece, i, j, state);
    }
  }
};

export const endTurn = (state: GameState) => {
  for (let i = 0; i < state.board.length; i++) {
    for (let j = 0; j < state.board[i].length; j++) {
      const f = getOnTurnEndF(state.board[i][j].piece.identifier);
      if (f) f(state.board[i][j].piece, i, j, state);
    }
  }
};

export const spawnNewRunes = (state: GameState) => {
  // Remove existing runes
  for (let i = 0; i < state.board.length; i++) {
    for (let j = 0; j < state.board[i].length; j++) {
      state.board[i][j].squareStatuses = state.board[i][j].squareStatuses.filter((s) => s !== SquareStatus.RUNE);
    }
  }
  // Spawn new runes in random unoccupied squares in the middle
  const colOps = [
    [2, 3],
    [6, 7],
  ];
  for (let i = 0; i < state.lightRuneSpawns; i++) {
    const row = 5;
    const index = Math.floor(Math.random() * colOps.length);
    const colGroup = colOps.splice(index, 1)[0];
    const col = colGroup[Math.floor(Math.random() * colGroup.length)];
    state.board[row][col].squareStatuses.push(SquareStatus.RUNE);
  }
  for (let i = 0; i < state.darkRuneSpawns; i++) {
    const row = 4;
    const index = Math.floor(Math.random() * colOps.length);
    const colGroup = colOps.splice(index, 1)[0];
    const col = colGroup[Math.floor(Math.random() * colGroup.length)];
    state.board[row][col].squareStatuses.push(SquareStatus.RUNE);
  }
};

export const gameover = (gameState: GameState, player: PlayerColour): boolean => {
  let gameOver = false;
  const opponent: PlayerColour = (player + 1) % 2;
  const opponentValidMoves: Move[] = [];
  let opponentKingAlive = false;
  let friendlyKingAlive = false;
  for (let i = 0; i < gameState.board.length; i++) {
    for (let j = 0; j < gameState.board[0].length; j++) {
      const piece = gameState.board[i][j].piece;
      if (piece.owner === player && piece.type === PieceType.king) {
        friendlyKingAlive = true;
      }
      if (piece.owner === opponent) {
        if (piece.type === PieceType.king) {
          opponentKingAlive = true;
        }
        const moveFunction = getMoveF(piece.identifier);
        if (moveFunction) opponentValidMoves.push(...moveFunction(piece, i, j, gameState, true));
      }
    }
  }
  if (!opponentKingAlive && !friendlyKingAlive) {
    // DRAW
    gameState.winner = PlayerColour.neutral;
    gameOver = true;
  } else if (!friendlyKingAlive) {
    gameState.winner = opponent;
    gameOver = true;
  } else if (!opponentKingAlive) {
    gameState.winner = player;
    gameOver = true;
  }

  let noRunes = false;
  if (opponent === PlayerColour.dark) noRunes = gameState.darkRunes <= 0;
  if (opponent === PlayerColour.light) noRunes = gameState.lightRunes <= 0;
  if (opponentValidMoves.length === 0 && noRunes) {
    gameOver = true;
    if (kingInCheck(gameState, opponent)) {
      // console.log('CHECKMATE');
      gameState.winner = player;
    } else {
      // console.log('DRAW');
      gameState.winner = PlayerColour.neutral;
    }
  }
  return gameOver;
};

export const selectedPieceCanMove = (gameState: GameState, row: number, col: number) => {
  if (gameState.turn % 2 === 0) {
    return gameState.board[row][col].piece.owner === PlayerColour.light;
  } else {
    return gameState.board[row][col].piece.owner === PlayerColour.dark;
  }
};

export const clearHighlights = (state: GameState) => {
  for (let i = 0; i < state.board.length; i++) {
    for (let j = 0; j < state.board[i].length; j++) {
      state.board[i][j].squareStatuses = state.board[i][j].squareStatuses.filter((s) => s !== SquareStatus.HL);
      state.board[i][j].squareStatuses = state.board[i][j].squareStatuses.filter((s) => s !== SquareStatus.HLC);
      state.board[i][j].squareStatuses = state.board[i][j].squareStatuses.filter((s) => s !== SquareStatus.HLK);
      state.board[i][j].squareStatuses = state.board[i][j].squareStatuses.filter((s) => s !== SquareStatus.QUICK_KILL);
    }
  }
};

export const clearAOEHighlights = (state: GameState) => {
  for (let i = 0; i < state.board.length; i++) {
    for (let j = 0; j < state.board[i].length; j++) {
      // TODO: Square TempStatus ?
      state.board[i][j].squareStatuses = state.board[i][j].squareStatuses.filter((s) => s !== SquareStatus.AOE);
      state.board[i][j].squareStatuses = state.board[i][j].squareStatuses.filter((s) => s !== SquareStatus.AOE_B);
      state.board[i][j].squareStatuses = state.board[i][j].squareStatuses.filter((s) => s !== SquareStatus.AOE_L);
      state.board[i][j].squareStatuses = state.board[i][j].squareStatuses.filter((s) => s !== SquareStatus.AOE_T);
      state.board[i][j].squareStatuses = state.board[i][j].squareStatuses.filter((s) => s !== SquareStatus.AOE_R);
      state.board[i][j].squareStatuses = state.board[i][j].squareStatuses.filter((s) => s !== SquareStatus.AOE_PSN);
      state.board[i][j].squareStatuses = state.board[i][j].squareStatuses.filter((s) => s !== SquareStatus.AOE_BLOOD);
      state.board[i][j].squareStatuses = state.board[i][j].squareStatuses.filter((s) => s !== SquareStatus.QUICK_KILL);
      state.board[i][j].squareStatuses = state.board[i][j].squareStatuses.filter(
        (s) => s !== SquareStatus.HL_POTENTIAL,
      );
    }
  }
};

export const handleEndOfTurn = (state: GameState, currentPlayer: PlayerColour) => {
  // CLEANUP
  state.activeAbility = '';
  state.abilityActivatedFlag = false;
  for (let i = 0; i < state.board.length; i++) {
    for (let j = 0; j < state.board[i].length; j++) {
      state.board[i][j].squareStatuses = state.board[i][j].squareStatuses.filter((s) => s !== SquareStatus.HL);
      state.board[i][j].squareStatuses = state.board[i][j].squareStatuses.filter((s) => s !== SquareStatus.SEL);
      state.board[i][j].squareStatuses = state.board[i][j].squareStatuses.filter((s) => s !== SquareStatus.HLC);
      state.board[i][j].squareStatuses = state.board[i][j].squareStatuses.filter((s) => s !== SquareStatus.HLK);
      state.board[i][j].squareStatuses = state.board[i][j].squareStatuses.filter((s) => s !== SquareStatus.QUICK_KILL);
    }
  }

  endTurn(state);
  state.turn++;
  // Check if any gameover conditions are met
  if (!gameover(state, currentPlayer)) {
    // If not, proceed to next turn
    startTurn(state);
  }
  state.selectedRow = null;
  state.selectedCol = null;
};
