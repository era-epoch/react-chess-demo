import { faBolt, faChessBishop } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import { clearHighlights } from '../../state/slices/game/helpers';
import { GameState, updateActiveAbility, resetSelection, selectSquare } from '../../state/slices/game/slice';
import {
  Piece,
  PlayerColour,
  Orientation,
  PieceType,
  PieceIdentifier,
  PieceOrigin,
  AbilitySelectFunction,
  AbilityFunction,
  PieceStatus,
} from '../../types';
import { getCurrentPlayer, isPlayersTurn } from '../../util';
import { Ability, getAbilityName, getAbilityRuneCost, registerAbility } from '../ability';
import { basicBishopMoveF, BishopDetail } from '../basic/basicBishop';
import { GamePiece, GamePieceDetailProps, registerGamePiece } from '../gamePiece';
import { genPID } from '../gameUtil';
import {
  standardOnDeathF,
  standardOnCaptureF,
  standardOnMovedF,
  standardOnTurnStartF,
  standardOnTurnEndF,
  standardAbilityHoverF,
} from '../standardFunctions';

export const ScourgeBishop = (): Piece => {
  const piece: Piece = {
    owner: PlayerColour.neutral,
    nMoves: 0,
    orientation: Orientation.neutral,
    statuses: [],
    type: PieceType.bishop,
    identifier: PieceIdentifier.scourgeBishop,
    origin: PieceOrigin.scourge,
    id: genPID(),
    name: 'Plague Doctor',
  };
  return piece;
};

export const ScourgeBishopDetail = (props: GamePieceDetailProps): JSX.Element => {
  const activeAbility = useSelector((state: RootState) => state.game.activeAbility);
  const selectedCol = useSelector((state: RootState) => state.game.selectedCol);
  const selectedRow = useSelector((state: RootState) => state.game.selectedRow);
  const turn = useSelector((state: RootState) => state.game.turn);
  const player = useSelector((state: RootState) => state.ui.player);
  const abilityId = 'cure';
  const dispatch = useDispatch();
  const handleClick = () => {
    if (props.piece && player.colour === props.piece.owner && isPlayersTurn(turn, player)) {
      if (activeAbility !== abilityId) {
        dispatch(updateActiveAbility(abilityId));
      } else {
        // Deactivate
        dispatch(updateActiveAbility(''));
        if (selectedCol && selectedRow) {
          dispatch(resetSelection()); // Since selecting the same square twice hides it
          dispatch(selectSquare({ row: selectedRow, col: selectedCol, player: player }));
        }
      }
    }
  };
  return (
    <div className={`detail ability quick${activeAbility === abilityId ? ' active' : ''}`} onClick={handleClick}>
      <div>
        <FontAwesomeIcon icon={faBolt} className="detail-icon rune" />
        <span className="detail-title">{getAbilityName(abilityId)}: </span>
        <span className="detail-info">
          (Quick) Remove one stack of <span className="emph poison-text">poisoned</span> from any of your pieces.
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

const ScourgeBishopGamePiece: GamePiece = {
  identifier: PieceIdentifier.scourgeBishop,
  moveF: basicBishopMoveF,
  onDeathF: standardOnDeathF,
  onCaptureF: standardOnCaptureF,
  onMovedF: standardOnMovedF,
  onTurnStartF: standardOnTurnStartF,
  onTurnEndF: standardOnTurnEndF,
  details: [ScourgeBishopDetail, BishopDetail],
  icon: faChessBishop,
};

registerGamePiece(ScourgeBishopGamePiece);

// ABILITIES

export const cureSelectF: AbilitySelectFunction = (source: Piece, state: GameState) => {
  clearHighlights(state);
};

export const cureAbilityF: AbilityFunction = (
  source: Piece,
  targetRow: number,
  targetCol: number,
  state: GameState,
) => {
  const abilityRuneCost = getAbilityRuneCost('cure');
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
  if (target.owner === player) {
    const index = target.statuses.findIndex((s: PieceStatus) => s === PieceStatus.PSN);
    if (index >= 0) {
      state.board[targetRow][targetCol].piece.statuses.splice(index, 1);
      state.abilityActivatedFlag = true;
    }
  }

  // Subtract rune cost if ability successfully activated
  if (player === PlayerColour.light) {
    if (state.abilityActivatedFlag) state.lightRunes -= abilityRuneCost;
  } else {
    if (state.abilityActivatedFlag) state.darkRunes -= abilityRuneCost;
  }
};

const CureAbility: Ability = {
  id: 'cure',
  name: 'Cure Sickness',
  renderString: 'ability-cure',
  runeCost: 1,
  quick: true,
  immediate: false,
  hoverF: standardAbilityHoverF,
  selectF: cureSelectF,
  abilityF: cureAbilityF,
};

registerAbility(CureAbility);
