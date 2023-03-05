import { faBolt, faChessKnight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import { clearHighlights } from '../../state/slices/game/helpers';
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
import { getCurrentPlayer, getPieceLocation, isPlayersTurn } from '../../util';
import { Ability, getAbilityName, getAbilityRuneCost, registerAbility } from '../ability';
import { basicKnightMoveF, KnightDetail } from '../basic/basicKnight';
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

export const ScourgeKnight = (): Piece => {
  const piece: Piece = {
    owner: PlayerColour.neutral,
    nMoves: 0,
    orientation: Orientation.neutral,
    statuses: [],
    identifier: PieceIdentifier.scourgeKnight,
    type: PieceType.knight,
    origin: PieceOrigin.scourge,
    id: genPID(),
    name: 'Bloated Mare',
  };
  return piece;
};

const ScourgeKnightDetail = (props: GamePieceDetailProps): JSX.Element => {
  const activeAbility = useSelector((state: RootState) => state.game.activeAbility);
  const selectedCol = useSelector((state: RootState) => state.game.selectedCol);
  const selectedRow = useSelector((state: RootState) => state.game.selectedRow);
  const turn = useSelector((state: RootState) => state.game.turn);
  const player = useSelector((state: RootState) => state.ui.player);
  const abilityId = 'noxious_cloud';
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
      className={`detail ability quick${activeAbility === abilityId ? ' active' : ''}`}
      onClick={handleClick}
      onMouseOver={startHover}
      onMouseOut={endHover}
    >
      <div>
        <FontAwesomeIcon icon={faBolt} className="detail-icon rune" />
        <span className="detail-title">{getAbilityName(abilityId)}: </span>
        <span className="detail-info">
          (Quick) <span className="emph poison-text">Poison</span> all pieces within 1 square of this piece, including
          this piece.
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

const ScourgeKnightGamePiece: GamePiece = {
  identifier: PieceIdentifier.scourgeKnight,
  moveF: basicKnightMoveF,
  onDeathF: standardOnDeathF,
  onCaptureF: standardOnCaptureF,
  onMovedF: standardOnMovedF,
  onTurnStartF: standardOnTurnStartF,
  onTurnEndF: standardOnTurnEndF,
  details: [ScourgeKnightDetail, KnightDetail],
  icon: faChessKnight,
};

registerGamePiece(ScourgeKnightGamePiece);

// ABILITY

const noxiousCloudHoverF: AbilityHoverFunction = (source: Piece, state: GameState) => {
  clearHighlights(state);
  const sourceLocation = getPieceLocation(source, state);
  const targetOffsets = [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
    [-1, 0],
    [0, -1],
    [-1, -1],
    [1, -1],
    [-1, 1],
  ];
  for (let i = 0; i < targetOffsets.length; i++) {
    const target = state.board[sourceLocation.row + targetOffsets[i][0]][sourceLocation.col + targetOffsets[i][1]];
    target.squareStatuses.push(...[SquareStatus.AOE, SquareStatus.AOE_PSN]);
  }
};

const noxiousCloudAbilityF: AbilityFunction = (
  source: Piece,
  targetRow: number,
  targetCol: number,
  state: GameState,
) => {
  const abilityRuneCost = getAbilityRuneCost('noxious_cloud');
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

  const sourceLocation = getPieceLocation(source, state);
  const targetOffsets = [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
    [-1, 0],
    [0, -1],
    [-1, -1],
    [1, -1],
    [-1, 1],
  ];

  for (let i = 0; i < targetOffsets.length; i++) {
    const target =
      state.board[sourceLocation.row + targetOffsets[i][0]][sourceLocation.col + targetOffsets[i][1]].piece;
    if (target.type !== PieceType.empty) {
      target.statuses.push(PieceStatus.PSN);
    }
  }
  state.abilityActivatedFlag = true;

  // Subtract rune cost if ability successfully activated
  if (player === PlayerColour.light) {
    if (state.abilityActivatedFlag) state.lightRunes -= abilityRuneCost;
  } else {
    if (state.abilityActivatedFlag) state.darkRunes -= abilityRuneCost;
  }
};

const NoxiousCloud: Ability = {
  id: 'noxious_cloud',
  name: 'Noxious Cloud',
  renderString: 'ability-nox-cloud',
  runeCost: 5,
  quick: true,
  immediate: true,
  hoverF: noxiousCloudHoverF,
  selectF: standardAbilitySelectF,
  abilityF: noxiousCloudAbilityF,
};

registerAbility(NoxiousCloud);
