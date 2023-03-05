import React from 'react';
import { CaptureFunction, DeathFunction, LifecycleFunction, MoveFunction, Piece, PieceIdentifier } from '../types';

export interface GamePieceDetailProps {
  piece: Piece | null;
}

export interface GamePiece {
  identifier: PieceIdentifier;
  moveF: MoveFunction;
  onDeathF: DeathFunction;
  onCaptureF: CaptureFunction;
  onMovedF: LifecycleFunction;
  onTurnStartF: LifecycleFunction;
  onTurnEndF: LifecycleFunction;
  details: React.FC<GamePieceDetailProps>[];
  icon: any;
}

export const GAME_PIECES: GamePiece[] = [];

export const registerGamePiece = (gp: GamePiece) => {
  GAME_PIECES.push(gp);
};

export const getMoveF = (id: PieceIdentifier): MoveFunction | undefined => {
  const GP = GAME_PIECES.find((gp: GamePiece) => gp.identifier === id);
  if (GP) return GP.moveF;
};

export const getDeathF = (id: PieceIdentifier): DeathFunction | undefined => {
  const GP = GAME_PIECES.find((gp: GamePiece) => gp.identifier === id);
  if (GP) return GP.onDeathF;
};

export const getCaptureF = (id: PieceIdentifier): CaptureFunction | undefined => {
  const GP = GAME_PIECES.find((gp: GamePiece) => gp.identifier === id);
  if (GP) return GP.onCaptureF;
};

export const getOnMovedF = (id: PieceIdentifier): LifecycleFunction | undefined => {
  const GP = GAME_PIECES.find((gp: GamePiece) => gp.identifier === id);
  if (GP) return GP.onMovedF;
};

export const getOnTurnStartF = (id: PieceIdentifier): LifecycleFunction | undefined => {
  const GP = GAME_PIECES.find((gp: GamePiece) => gp.identifier === id);
  if (GP) return GP.onTurnStartF;
};

export const getOnTurnEndF = (id: PieceIdentifier): LifecycleFunction | undefined => {
  const GP = GAME_PIECES.find((gp: GamePiece) => gp.identifier === id);
  if (GP) return GP.onTurnEndF;
};

export const getDetails = (id: PieceIdentifier): React.FC<GamePieceDetailProps>[] | undefined => {
  const GP = GAME_PIECES.find((gp: GamePiece) => gp.identifier === id);
  if (GP) return GP.details;
};

export const getIcon = (id: PieceIdentifier): any | undefined => {
  const GP = GAME_PIECES.find((gp: GamePiece) => gp.identifier === id);
  if (GP) return GP.icon;
};
