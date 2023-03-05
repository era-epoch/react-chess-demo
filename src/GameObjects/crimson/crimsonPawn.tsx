import { faBolt, faChessPawn } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector, useDispatch } from 'react-redux';
import { wsEmitMove } from '../../socketMiddleware';
import { RootState } from '../../state/rootReducer';
import { endTurnDirect, GameState, tryActivateAbility, updateActiveAbility } from '../../state/slices/game/slice';
import { OnlineGameStatus, swapLocalPlayer } from '../../state/slices/ui/slice';
import { store } from '../../state/store';
import {
  Piece,
  PlayerColour,
  PieceIdentifier,
  PieceOrigin,
  Orientation,
  PieceType,
  MoveFunction,
  Move,
  PieceStatus,
  MoveFlag,
  AbilityFunction,
  LifecycleFunction,
} from '../../types';
import { getCurrentPlayer, isPlayersTurn } from '../../util';
import { Ability, getAbilityName, getAbilityRuneCost, registerAbility } from '../ability';
import { basicPawnMoveF, EnPassantDetail, PawnDetail, PromotionDetail } from '../basic/basicPawn';
import { GamePiece, GamePieceDetailProps, registerGamePiece } from '../gamePiece';
import { genPID } from '../gameUtil';
import {
  standardOnDeathF,
  standardOnCaptureF,
  standardOnMovedF,
  standardOnTurnStartF,
  standardOnTurnEndF,
  standardAbilitySelectF,
  standardAbilityHoverF,
} from '../standardFunctions';

export const CrimsonPawn = (): Piece => {
  const piece: Piece = {
    owner: PlayerColour.neutral,
    identifier: PieceIdentifier.crimsonPawn,
    origin: PieceOrigin.crimson,
    nMoves: 0,
    orientation: Orientation.neutral,
    statuses: [],
    type: PieceType.pawn,
    id: genPID(),
    name: 'Thrall',
  };
  return piece;
};

export const crimsonPawnMoveF: MoveFunction = (
  piece: Piece,
  row: number,
  col: number,
  state: GameState,
  checkKing: boolean = true,
): Move[] => {
  const moves = basicPawnMoveF(piece, row, col, state, checkKing);
  if (piece.statuses.includes(PieceStatus.bloodthirsty)) {
    if (piece.orientation === Orientation.bottom) {
      if (state.board[row - 1][col].piece.owner === (piece.owner + 1) % 2) {
        moves.push({ row: row - 1, col: col, flags: [MoveFlag.KILL], oRow: row, oCol: col });
      }
    } else if (piece.orientation === Orientation.top) {
      if (state.board[row + 1][col].piece.owner === (piece.owner + 1) % 2) {
        moves.push({ row: row + 1, col: col, flags: [MoveFlag.KILL], oRow: row, oCol: col });
      }
    }
  }
  return moves;
};

export const crimsonPawnOnMovedF: LifecycleFunction = (piece: Piece, row: number, col: number, state: GameState) => {
  standardOnMovedF(piece, row, col, state);
  const index = piece.statuses.findIndex((s: PieceStatus) => s === PieceStatus.bloodthirsty);
  if (index >= 0) {
    piece.statuses.splice(index, 1);
    state.abilityActivatedFlag = true;
  }
};

export const CrimsonPawnDetail = (props: GamePieceDetailProps): JSX.Element => {
  const activeAbility = useSelector((state: RootState) => state.game.activeAbility);
  const selectedCol = useSelector((state: RootState) => state.game.selectedCol);
  const selectedRow = useSelector((state: RootState) => state.game.selectedRow);
  const onlineGame = useSelector((state: RootState) => state.ui.onlineGameStatus);
  const turn = useSelector((state: RootState) => state.game.turn);
  const player = useSelector((state: RootState) => state.ui.player);
  const abilityId = 'bloodthirst';
  const dispatch = useDispatch();

  const handleTurnEnd = () => {
    // If online game, emit the new game state
    if (onlineGame === OnlineGameStatus.SUCCESS) {
      const newGameState = store.getState().game;
      dispatch(wsEmitMove(newGameState));
    }
    // If local hotseat game, switch players
    if (onlineGame === OnlineGameStatus.NONE) {
      dispatch(swapLocalPlayer());
      // dispatch(toggleBoardInversion());
    }
  };

  const handleClick = () => {
    if (props.piece && player.colour === props.piece.owner && isPlayersTurn(turn, player)) {
      if (selectedCol && selectedRow) {
        dispatch(updateActiveAbility(abilityId));
        dispatch(tryActivateAbility({ row: selectedRow, col: selectedCol }));
        if (store.getState().game.abilityActivatedFlag) {
          dispatch(endTurnDirect());
          if (store.getState().game.postTurnResolutionQueue.length === 0) {
            handleTurnEnd();
          }
        }
      }
    }
  };
  return (
    <div
      className={`detail ability immediate quick${activeAbility === abilityId ? ' active' : ''}`}
      onClick={handleClick}
    >
      <div>
        <FontAwesomeIcon icon={faBolt} className="detail-icon rune" />
        <span className="detail-title">{getAbilityName(abilityId)}: </span>
        <span className="detail-info">
          This piece becomes <span className="emph blood">bloodthirsty</span>: the next time it moves, it can capture by
          moving one space forward. This piece loses one stack of <span className="emph blood">bloodthirsty</span> after
          moving.
        </span>
      </div>
      <div>
        <div className="detail-rune-cost">
          <div className={`rune`}>
            <FontAwesomeIcon icon={faBolt} />
          </div>
          <div>{getAbilityRuneCost(abilityId)}</div>
        </div>
      </div>
    </div>
  );
};

const CrimsonPawnGamePiece: GamePiece = {
  identifier: PieceIdentifier.crimsonPawn,
  moveF: crimsonPawnMoveF,
  onDeathF: standardOnDeathF,
  onCaptureF: standardOnCaptureF,
  onMovedF: crimsonPawnOnMovedF,
  onTurnStartF: standardOnTurnStartF,
  onTurnEndF: standardOnTurnEndF,
  details: [CrimsonPawnDetail, PawnDetail, EnPassantDetail, PromotionDetail],
  icon: faChessPawn,
};

registerGamePiece(CrimsonPawnGamePiece);

// ABILITY

export const bloodthirstAbilityF: AbilityFunction = (
  source: Piece,
  targetRow: number,
  targetCol: number,
  state: GameState,
) => {
  const abilityRuneCost = getAbilityRuneCost('bloodthirst');
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

  source.statuses.push(PieceStatus.bloodthirsty);
  state.abilityActivatedFlag = true;

  // Subtract rune cost if ability successfully activated
  if (player === PlayerColour.light) {
    if (state.abilityActivatedFlag) state.lightRunes -= abilityRuneCost;
  } else {
    if (state.abilityActivatedFlag) state.darkRunes -= abilityRuneCost;
  }
};

const BloodthirstAbility: Ability = {
  id: 'bloodthirst',
  name: 'Activate Bloodthirst',
  renderString: 'ability-bloodthirst',
  runeCost: 1,
  quick: false,
  immediate: true,
  hoverF: standardAbilityHoverF,
  selectF: standardAbilitySelectF,
  abilityF: bloodthirstAbilityF,
};

registerAbility(BloodthirstAbility);
