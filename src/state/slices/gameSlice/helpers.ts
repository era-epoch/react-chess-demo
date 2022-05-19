import { EmptySquare, kingInCheck } from '../../../GameObjects/piecesBasic';
import { Piece, Move, MoveFlag, SquareStatus, PieceType, Graveyard, Player } from '../../../types';
import { GameState } from './slice';

export const movePiece = (gameState: GameState, piece: Piece, move: Move) => {
  // piece.onMove();
  // Castle Logic
  if (move.flags?.has(MoveFlag.CSTL)) {
    let kingPos = 0;
    // Look for the selected king *in this row*
    for (let i = 0; i < gameState.board[move.row].length; i++) {
      if (gameState.board[move.row][i].squareStatuses.has(SquareStatus.SEL)) {
        kingPos = i;
        break;
      }
    }
    if (move.col < kingPos) {
      // Castling to the left
      let i = 1;
      while (gameState.board[move.row][move.col - i].piece.pieceType !== PieceType.rook) {
        i++;
      }
      gameState.board[move.row][move.col + 1].piece = gameState.board[move.row][move.col - i].piece;
      gameState.board[move.row][move.col - i].piece = EmptySquare();
    } else {
      // Castling to the right
      let i = 1;
      while (gameState.board[move.row][move.col + i].piece.pieceType !== PieceType.rook) {
        i++;
      }
      gameState.board[move.row][move.col - 1].piece = gameState.board[move.row][move.col + i].piece;
      gameState.board[move.row][move.col + i].piece = EmptySquare();
    }
  }
  // En passant capture logic
  if (
    gameState.board[move.row][move.col].squareStatuses.has(SquareStatus.EPV) &&
    gameState.board[move.row][move.col].enPassantOrigin?.owner !== piece.owner
  ) {
    let i = 0;
    for (const row of gameState.board) {
      let j = 0;
      for (const cell of row) {
        if (gameState.board[i][j].piece.id === gameState.board[move.row][move.col].enPassantOrigin?.id) {
          // gameState.board[i][j].piece.onDeath()
          removePieceAtLocation(gameState, i, j);
        }
        j++;
      }
      i++;
    }
  }
  // Post EP cleanup
  let i = 0;
  for (const row of gameState.board) {
    let j = 0;
    for (const cell of row) {
      gameState.board[i][j].squareStatuses.delete(SquareStatus.EPV);
      gameState.board[i][j].enPassantOrigin = null;
      j++;
    }
    i++;
  }
  // En passant logic
  if (move.flags?.has(MoveFlag.EP)) {
    let pawnPos = 0;
    // Look for the selected pawn *in this column*
    for (let i = 0; i < gameState.board.length; i++) {
      if (gameState.board[i][move.col].squareStatuses.has(SquareStatus.SEL)) {
        pawnPos = i;
        break;
      }
    }
    if (pawnPos < move.row) {
      // En passant square is above
      gameState.board[move.row - 1][move.col].squareStatuses.add(SquareStatus.EPV);
      gameState.board[move.row - 1][move.col].enPassantOrigin = piece;
    } else {
      // En passant square is below
      gameState.board[move.row + 1][move.col].squareStatuses.add(SquareStatus.EPV);
      gameState.board[move.row + 1][move.col].enPassantOrigin = piece;
    }
  }
  gameState.board[move.row][move.col].piece = piece;
  gameState.board[move.row][move.col].piece.nMoves++;
};

export const removePieceAtLocation = (gameState: GameState, row: number, col: number) => {
  // .onDeath();
  const player = gameState.board[row][col].piece.owner;
  const graveyard = gameState.graveyards.find((g: Graveyard) => g.player === (player + 1) % 2);
  if (gameState.board[row][col].piece.pieceType !== PieceType.empty) {
    graveyard?.contents.push(gameState.board[row][col].piece);
  }
  gameState.board[row][col].piece = EmptySquare();
};

export const isGameover = (gameState: GameState, player: Player): boolean => {
  const opponent: Player = (player + 1) % 2;
  const validMoves: Move[] = [];
  for (let i = 0; i < gameState.board.length; i++) {
    for (let j = 0; j < gameState.board[0].length; j++) {
      if (gameState.board[i][j].piece.owner === opponent) {
        validMoves.push(...gameState.board[i][j].piece.moveF(gameState.board[i][j].piece, i, j, gameState, true));
      }
    }
  }
  return validMoves.length === 0;
};

export const handleGameover = (gameState: GameState, player: Player) => {
  const opponent: Player = (player + 1) % 2;
  if (kingInCheck(gameState, opponent)) {
    // console.log('CHECKMATE');
    gameState.winner = player;
  } else {
    // console.log('STALEMATE');
    gameState.winner = Player.neutral;
  }
  gameState.completed = true;
};

export const selectedPieceCanMove = (gameState: GameState, row: number, col: number) => {
  if (gameState.turn % 2 === 0) {
    return gameState.board[row][col].piece.owner === Player.light;
  } else {
    return gameState.board[row][col].piece.owner === Player.dark;
  }
};
