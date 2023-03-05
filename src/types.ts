import { GameState } from './state/slices/game/slice';

export enum PlayerColour {
  'light' = 0,
  'dark' = 1,
  'neutral' = 2,
  'random' = 3,
}

export enum Orientation {
  'top' = 0,
  'bottom' = 1,
  'neutral' = 2,
}

export enum SquareStatus {
  HL = 'square-highlighted',
  HLC = 'square-highlighted-castle',
  HLK = 'square-highlighted-kill',
  HL_POTENTIAL = 'highlighted-potential',
  SEL = 'square-selected',
  EPV = 'en-passant-vulnerable',
  QUICK_KILL = 'quick-kill',
  RUNE = 'rune',
  BLOODIED = 'bloodied',
  AOE = 'aoe',
  AOE_L = 'aoe-left',
  AOE_R = 'aoe-right',
  AOE_T = 'aoe-top',
  AOE_B = 'aoe-bottom',
  AOE_PSN = 'aoe-poison',
  AOE_BLOOD = 'aoe-blood',
}

export enum PieceStatus {
  PSN = 'poisoned',
  bloodthirsty = 'bloodthirsty',
  immune = 'immune',
  WINGS = 'wings',
}

export enum PieceType {
  empty = 'Empty Square',
  pawn = 'Pawn',
  rook = 'Rook',
  knight = 'Knight',
  bishop = 'Bishop',
  queen = 'Queen',
  king = 'King',
}

export const typeAlgebriacNotationMap = new Map<PieceType, string>([
  [PieceType.empty, ''],
  [PieceType.pawn, ''],
  [PieceType.rook, 'R'],
  [PieceType.knight, 'N'],
  [PieceType.bishop, 'B'],
  [PieceType.king, 'K'],
  [PieceType.queen, 'Q'],
]);

export enum MoveFlag {
  CSTL = 'castle',
  KILL = 'kill',
  EP = 'en-passant',
  PROMO = 'promotion',
}

export enum PieceOrigin {
  basic = 'Basic',
  scourge = 'Scourge',
  crimson = 'Crimson',
}

export enum PieceIdentifier {
  'empty',
  'basicPawn',
  'basicRook',
  'basicKnight',
  'basicBishop',
  'basicQueen',
  'basicKing',
  'scourgePawn',
  'scourgeBishop',
  'scourgeKnight',
  'scourgeRook',
  'scourgeQueen',
  'scourgeKing',
  'crimsonPawn',
  'crimsonBishop',
  'crimsonKnight',
  'crimsonRook',
  'crimsonQueen',
  'crimsonKing',
  'umbralPawn',
  'umbralBishop',
  'umbralKnight',
  'umbralRook',
  'umbralQueen',
  'umbralKing',
  'Pawn',
  'Bishop',
  'Knight',
  'Rook',
  'Queen',
  'King',
}

export interface Move {
  row: number;
  col: number;
  oRow?: number;
  oCol?: number;
  flags: MoveFlag[];
}

export interface UserInfo {
  name: string;
  id: string;
  colour: PlayerColour;
  elo?: number;
}

export interface SquareContents {
  inBounds: boolean;
  piece: Piece;
  squareStatuses: SquareStatus[];
  enPassantOrigin: Piece | null;
  row: number;
  col: number;
}

export interface Piece {
  name: string;
  id: number;
  owner: PlayerColour;
  identifier: PieceIdentifier;
  type: PieceType;
  origin: PieceOrigin;
  statuses: PieceStatus[];
  nMoves: number;
  orientation: Orientation;
}

export interface ResolutionEvent {
  type: ResolutionEventType;
  source?: Piece;
  target?: Piece;
  row?: number;
  col?: number;
}

export enum ResolutionEventType {
  PawnPromotion = 'PawnPromotion',
  BloodSacrifice = 'BloodSacrifice',
  AlacrityChain = 'AlacrityChain',
}

export type Board = SquareContents[][];

export type MoveFunction = (piece: Piece, row: number, col: number, state: GameState, checkKing: boolean) => Move[];

export type DeathFunction = (piece: Piece, row: number, col: number, state: GameState, capturer?: Piece) => void;

export type CaptureFunction = (piece: Piece, row: number, col: number, state: GameState, target: Piece) => void;

export type LifecycleFunction = (piece: Piece, row: number, col: number, state: GameState) => void;

export type AbilityFunction = (source: Piece, targetRow: number, targetCol: number, state: GameState) => void;

export type AbilitySelectFunction = (source: Piece, state: GameState) => void;

export type AbilityHoverFunction = (source: Piece, state: GameState) => void;

export interface Graveyard {
  player: PlayerColour;
  contents: Piece[];
}
