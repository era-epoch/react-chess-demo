import { faChessRook, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import { clearAOEHighlights, clearHighlights } from '../../state/slices/game/helpers';
import { GameState } from '../../state/slices/game/slice';
import {
  Piece,
  PlayerColour,
  Orientation,
  PieceIdentifier,
  PieceType,
  PieceOrigin,
  AbilitySelectFunction,
  AbilityFunction,
  PieceStatus,
  SquareStatus,
  Move,
  MoveFlag,
  CaptureFunction,
  ResolutionEventType,
} from '../../types';
import { getCurrentPlayer } from '../../util';
import { Ability, getAbilityRuneCost, registerAbility } from '../ability';
import { RookDetail } from '../basic/basicRook';
import { GamePiece, GamePieceDetailProps, registerGamePiece } from '../gamePiece';
import { filterMoves, genPID } from '../gameUtil';
import {
  standardOnDeathF,
  standardOnCaptureF,
  standardOnMovedF,
  standardOnTurnStartF,
  standardOnTurnEndF,
  standardAbilityHoverF,
} from '../standardFunctions';

export const CrimsonRook = (): Piece => {
  const piece: Piece = {
    owner: PlayerColour.neutral,
    nMoves: 0,
    orientation: Orientation.neutral,
    statuses: [],
    identifier: PieceIdentifier.crimsonRook,
    type: PieceType.rook,
    origin: PieceOrigin.crimson,
    id: genPID(),
    name: 'Sacrificial Altar',
  };
  return piece;
};

const crimsonRookMoveF = (
  piece: Piece,
  row: number,
  col: number,
  state: GameState,
  checkKing: boolean = true,
): Move[] => {
  const board = state.board;
  let moves: Move[] = [];
  let i = 1;
  while (row + i < board.length && board[row + i][col].piece.type === PieceType.empty) {
    moves.push({ row: row + i, col: col, oRow: row, oCol: col, flags: [] });
    i++;
  }
  if (row + i < board.length) {
    moves.push({ row: row + i, col: col, flags: [MoveFlag.KILL], oRow: row, oCol: col });
  }
  i = 1;
  while (row - i >= 0 && board[row - i][col].piece.type === PieceType.empty) {
    moves.push({ row: row - i, col: col, oRow: row, oCol: col, flags: [] });
    i++;
  }
  if (row - i >= 0) {
    moves.push({ row: row - i, col: col, flags: [MoveFlag.KILL], oRow: row, oCol: col });
  }
  i = 1;
  while (col + i < board[0].length && board[row][col + i].piece.type === PieceType.empty) {
    moves.push({ row: row, col: col + i, oRow: row, oCol: col, flags: [] });
    i++;
  }
  if (col + i < board[0].length) {
    moves.push({ row: row, col: col + i, flags: [MoveFlag.KILL], oRow: row, oCol: col });
  }
  i = 1;
  while (col - i >= 0 && board[row][col - i].piece.type === PieceType.empty) {
    moves.push({ row: row, col: col - i, oRow: row, oCol: col, flags: [] });
    i++;
  }
  if (col - i >= 0) {
    moves.push({ row: row, col: col - i, flags: [MoveFlag.KILL], oRow: row, oCol: col });
  }
  return filterMoves(piece, row, col, state, moves, checkKing);
};

const crimsonRookOnCaptureF: CaptureFunction = (
  piece: Piece,
  row: number,
  col: number,
  state: GameState,
  target: Piece,
) => {
  standardOnCaptureF(piece, row, col, state, target);
  state.postTurnResolutionQueue.push({ type: ResolutionEventType.BloodSacrifice, source: piece });
};

const CrimsonRookDetail = (props: GamePieceDetailProps): JSX.Element => {
  const resolutions = useSelector((state: RootState) => state.game.postTurnResolutionQueue);
  let active = false;
  if (resolutions.length > 0) {
    active = resolutions[0].type === ResolutionEventType.BloodSacrifice;
  }
  return (
    <div className={`detail text-detail${active ? ' blood-bg' : ''}`}>
      <div>
        <FontAwesomeIcon icon={faStar} className="detail-icon" />
        <span className="detail-title">Blood Sacrifice: </span>
        <span className="detail-info">
          This piece can capture friendly pieces. Whenever this piece captures another piece, choose one of your pawns
          to become <span className="emph blood">bloodthirsty</span>.
        </span>
      </div>
    </div>
  );
};

const CrimsonRookGamePiece: GamePiece = {
  identifier: PieceIdentifier.crimsonRook,
  moveF: crimsonRookMoveF,
  onDeathF: standardOnDeathF,
  onCaptureF: crimsonRookOnCaptureF,
  onMovedF: standardOnMovedF,
  onTurnStartF: standardOnTurnStartF,
  onTurnEndF: standardOnTurnEndF,
  details: [CrimsonRookDetail, RookDetail],
  icon: faChessRook,
};

registerGamePiece(CrimsonRookGamePiece);

// ABILITIES

const bloodSacrificeSelectF: AbilitySelectFunction = (source: Piece, state: GameState) => {
  clearHighlights(state);
  let validTarget = false;
  for (let i = 0; i < state.board.length; i++) {
    for (let j = 0; j < state.board[i].length; j++) {
      if (state.board[i][j].piece.owner === source.owner && state.board[i][j].piece.type === PieceType.pawn) {
        validTarget = true;
        state.board[i][j].squareStatuses.push(...[SquareStatus.AOE, SquareStatus.AOE_BLOOD]);
      }
    }
  }
  if (!validTarget) {
    // Resolution ends; no valid targets
    state.postTurnResolutionQueue.shift();
  }
};

const bloodSacrificeAbilityF: AbilityFunction = (
  source: Piece,
  targetRow: number,
  targetCol: number,
  state: GameState,
) => {
  const abilityRuneCost = getAbilityRuneCost('blood_sacrifice');
  if (abilityRuneCost === undefined) return;

  const player = getCurrentPlayer(state.turn);

  // TODO: Check this before entering the reducer to allow for visual feedback
  // Insufficient Runes
  if (player === PlayerColour.light) {
    if (state.lightRunes < abilityRuneCost) {
      return;
    }
  } else {
    if (state.darkRunes < abilityRuneCost) {
      return;
    }
  }

  const target = state.board[targetRow][targetCol].piece;
  if (target.owner === source.owner && target.type === PieceType.pawn) {
    target.statuses.push(PieceStatus.bloodthirsty);
    state.abilityActivatedFlag = true;
  }

  // Subtract rune cost if ability successfully activated
  if (player === PlayerColour.light) {
    if (state.abilityActivatedFlag) state.lightRunes -= abilityRuneCost;
  } else {
    if (state.abilityActivatedFlag) state.darkRunes -= abilityRuneCost;
  }
  if (state.abilityActivatedFlag) {
    clearAOEHighlights(state);
    state.postTurnResolutionQueue.shift();
  }
};

const BloodSacrificeAbility: Ability = {
  id: 'blood_sacrifice',
  name: 'Blood Sacrifice',
  renderString: 'ability-blood_sacrifice',
  runeCost: 0,
  quick: false,
  immediate: false,
  hoverF: standardAbilityHoverF,
  selectF: bloodSacrificeSelectF,
  abilityF: bloodSacrificeAbilityF,
};

registerAbility(BloodSacrificeAbility);
