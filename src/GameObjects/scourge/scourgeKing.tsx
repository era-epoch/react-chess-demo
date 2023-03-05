import { faBolt, faChessKing } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import { clearAOEHighlights, clearHighlights } from '../../state/slices/game/helpers';
import {
  updateActiveAbility,
  resetSelection,
  clearAOE,
  selectSquare,
  GameState,
  hoverActiveAbility,
  tryActivateAbility,
} from '../../state/slices/game/slice';
import {
  Piece,
  PlayerColour,
  Orientation,
  PieceIdentifier,
  PieceType,
  PieceOrigin,
  AbilityFunction,
  PieceStatus,
  AbilityHoverFunction,
  SquareStatus,
} from '../../types';
import { getCurrentPlayer, isPlayersTurn } from '../../util';
import { Ability, getAbilityName, getAbilityRuneCost, registerAbility } from '../ability';
import { basicKingMoveF, CastlingDetail, KingDetail } from '../basic/basicKing';
import { GamePiece, GamePieceDetailProps, registerGamePiece } from '../gamePiece';
import { genPID } from '../gameUtil';
import {
  standardOnDeathF,
  standardOnCaptureF,
  standardOnMovedF,
  standardOnTurnStartF,
  standardOnTurnEndF,
  standardAbilitySelectF,
} from '../standardFunctions';

export const ScourgeKing = (): Piece => {
  const piece: Piece = {
    owner: PlayerColour.neutral,
    nMoves: 0,
    orientation: Orientation.neutral,
    statuses: [PieceStatus.immune],
    identifier: PieceIdentifier.scourgeKing,
    type: PieceType.king,
    origin: PieceOrigin.scourge,
    id: genPID(),
    name: 'Harbinger of Contagion',
  };
  return piece;
};

const ScourgeKingDetail = (props: GamePieceDetailProps): JSX.Element => {
  const activeAbility = useSelector((state: RootState) => state.game.activeAbility);
  const selectedCol = useSelector((state: RootState) => state.game.selectedCol);
  const selectedRow = useSelector((state: RootState) => state.game.selectedRow);
  const turn = useSelector((state: RootState) => state.game.turn);
  const player = useSelector((state: RootState) => state.ui.player);
  const abilityId = 'contagion';
  const dispatch = useDispatch();

  const handleClick = () => {
    if (props.piece && player.colour === props.piece.owner && isPlayersTurn(turn, player)) {
      if (selectedCol && selectedRow) {
        dispatch(updateActiveAbility(abilityId));
        dispatch(tryActivateAbility({ row: selectedRow, col: selectedCol }));
      }
    }
  };
  const startHover = () => {
    if (props.piece && player.colour === props.piece.owner && isPlayersTurn(turn, player)) {
      dispatch(updateActiveAbility(abilityId));
      dispatch(hoverActiveAbility());
    }
  };
  const endHover = () => {
    if (
      props.piece &&
      player.colour === props.piece.owner &&
      isPlayersTurn(turn, player) &&
      selectedCol &&
      selectedRow
    ) {
      dispatch(updateActiveAbility(''));
      dispatch(resetSelection()); // Since selecting the same square twice hides it
      dispatch(clearAOE());
      dispatch(selectSquare({ row: selectedRow, col: selectedCol, player: player }));
    }
  };
  return (
    <div
      className={`detail ability ${activeAbility === abilityId ? ' active' : ''}`}
      onClick={handleClick}
      onMouseOver={startHover}
      onMouseOut={endHover}
    >
      <div>
        <FontAwesomeIcon icon={faBolt} className="detail-icon rune" />
        <span className="detail-title">{getAbilityName(abilityId)}: </span>
        <span className="detail-info">
          (Quick) <span className="emph poison-text">Poison</span> every piece on the board.
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

const ScourgeKingGamePiece: GamePiece = {
  identifier: PieceIdentifier.scourgeKing,
  moveF: basicKingMoveF,
  onDeathF: standardOnDeathF,
  onCaptureF: standardOnCaptureF,
  onMovedF: standardOnMovedF,
  onTurnStartF: standardOnTurnStartF,
  onTurnEndF: standardOnTurnEndF,
  details: [ScourgeKingDetail, KingDetail, CastlingDetail],
  icon: faChessKing,
};

registerGamePiece(ScourgeKingGamePiece);

// ABILITY

const contagionHoverF: AbilityHoverFunction = (source: Piece, state: GameState) => {
  clearHighlights(state);
  for (let i = 0; i < state.board.length; i++) {
    for (let j = 0; j < state.board[i].length; j++) {
      state.board[i][j].squareStatuses.push(...[SquareStatus.AOE, SquareStatus.AOE_PSN]);
    }
  }
};

const contagionAbilityF: AbilityFunction = (source: Piece, targetRow: number, targetCol: number, state: GameState) => {
  const abilityRuneCost = getAbilityRuneCost('contagion');
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

  for (let i = 0; i < state.board.length; i++) {
    for (let j = 0; j < state.board[i].length; j++) {
      if (state.board[i][j].piece.type !== PieceType.empty) {
        state.board[i][j].piece.statuses.push(PieceStatus.PSN);
      }
    }
  }
  state.abilityActivatedFlag = true;

  // Subtract rune cost if ability successfully activated
  if (player === PlayerColour.light) {
    if (state.abilityActivatedFlag) state.lightRunes -= abilityRuneCost;
  } else {
    if (state.abilityActivatedFlag) state.darkRunes -= abilityRuneCost;
  }
  if (state.abilityActivatedFlag) clearAOEHighlights(state);
};

const Contagion: Ability = {
  id: 'contagion',
  name: 'Contagion',
  renderString: 'ability-contagion',
  runeCost: 20,
  quick: true,
  immediate: true,
  hoverF: contagionHoverF,
  selectF: standardAbilitySelectF,
  abilityF: contagionAbilityF,
};

registerAbility(Contagion);
