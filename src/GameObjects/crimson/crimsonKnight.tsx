import { faBolt, faChessKnight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import { clearAOEHighlights, clearHighlights } from '../../state/slices/game/helpers';
import {
  updateActiveAbility,
  resetSelection,
  selectSquare,
  GameState,
  clearAOE,
  hoverActiveAbility,
  tryActivateAbility,
} from '../../state/slices/game/slice';
import { store } from '../../state/store';
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
  Move,
  LifecycleFunction,
} from '../../types';
import { getCurrentPlayer, getPieceLocation, isPlayersTurn } from '../../util';
import { Ability, getAbilityName, getAbilityRuneCost, registerAbility } from '../ability';
import { basicKnightMoveF, KnightDetail } from '../basic/basicKnight';
import { GamePiece, GamePieceDetailProps, registerGamePiece } from '../gamePiece';
import { filterMoves, genPID } from '../gameUtil';
import {
  standardOnDeathF,
  standardOnCaptureF,
  standardOnMovedF,
  standardOnTurnStartF,
  standardOnTurnEndF,
  standardAbilitySelectF,
} from '../standardFunctions';

export const CrimsonKnight = (): Piece => {
  const piece: Piece = {
    owner: PlayerColour.neutral,
    nMoves: 0,
    orientation: Orientation.neutral,
    statuses: [],
    identifier: PieceIdentifier.crimsonKnight,
    type: PieceType.knight,
    origin: PieceOrigin.crimson,
    id: genPID(),
    name: 'Chiroptera',
  };
  return piece;
};

const crimsonKnightMoveF = (
  piece: Piece,
  row: number,
  col: number,
  state: GameState,
  checkKing: boolean = true,
): Move[] => {
  const moves = basicKnightMoveF(piece, row, col, state, checkKing);
  for (let i = 0; i < state.board.length; i++) {
    for (let j = 0; j < state.board[i].length; j++) {
      if (piece.statuses.includes(PieceStatus.WINGS)) {
        const xDiff = Math.abs(j - col);
        const yDiff = Math.abs(i - row);
        const totalDiff = xDiff + yDiff;
        if (
          totalDiff > 0 &&
          xDiff < 3 &&
          yDiff < 3 &&
          state.board[i][j].piece.type === PieceType.empty &&
          state.board[i][j].inBounds
        ) {
          moves.push({ row: i, col: j, flags: [], oCol: col, oRow: row });
        }
      }
    }
  }
  return filterMoves(piece, row, col, state, moves, checkKing);
};

const crimsonKnightOnTurnEndF: LifecycleFunction = (piece: Piece, row: number, col: number, state: GameState): void => {
  piece.statuses = piece.statuses.filter((s) => s !== PieceStatus.WINGS);
  standardOnTurnEndF(piece, row, col, state);
};

const CrimsonKnightDetail = (props: GamePieceDetailProps): JSX.Element => {
  const activeAbility = useSelector((state: RootState) => state.game.activeAbility);
  const selectedCol = useSelector((state: RootState) => state.game.selectedCol);
  const selectedRow = useSelector((state: RootState) => state.game.selectedRow);
  const turn = useSelector((state: RootState) => state.game.turn);
  const player = useSelector((state: RootState) => state.ui.player);
  const abilityId = 'wings_of_flesh';
  const dispatch = useDispatch();
  const handleClick = () => {
    if (props.piece && player.colour === props.piece.owner && isPlayersTurn(turn, player)) {
      if (selectedCol && selectedRow && activeAbility === abilityId) {
        dispatch(tryActivateAbility({ row: selectedRow, col: selectedCol }));
        if (store.getState().game.abilityActivatedFlag) {
          dispatch(updateActiveAbility(''));
          dispatch(resetSelection()); // Since selecting the same square twice hides it
          dispatch(clearAOE());
          dispatch(selectSquare({ row: selectedRow, col: selectedCol, player: player }));
        }
      }
    }
  };
  const startHover = () => {
    if (props.piece?.statuses.includes(PieceStatus.WINGS)) return;
    if (props.piece && player.colour === props.piece.owner && isPlayersTurn(turn, player)) {
      dispatch(updateActiveAbility(abilityId));
      dispatch(hoverActiveAbility());
    }
  };
  const endHover = () => {
    if (props.piece?.statuses.includes(PieceStatus.WINGS)) return;
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
      className={`detail ability quick${
        activeAbility === abilityId || props.piece?.statuses.includes(PieceStatus.WINGS) ? ' active' : ''
      }`}
      onClick={handleClick}
      onMouseOver={startHover}
      onMouseOut={endHover}
    >
      <div>
        <FontAwesomeIcon icon={faBolt} className="detail-icon rune" />
        <span className="detail-title">{getAbilityName(abilityId)}: </span>
        <span className="detail-info">
          (Quick) This turn, in addition to its normal movement, this piece can move to any unoccupied space within two
          squares.
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

const CrimsonKnightGamePiece: GamePiece = {
  identifier: PieceIdentifier.crimsonKnight,
  moveF: crimsonKnightMoveF,
  onDeathF: standardOnDeathF,
  onCaptureF: standardOnCaptureF,
  onMovedF: standardOnMovedF,
  onTurnStartF: standardOnTurnStartF,
  onTurnEndF: crimsonKnightOnTurnEndF,
  details: [CrimsonKnightDetail, KnightDetail],
  icon: faChessKnight,
};

registerGamePiece(CrimsonKnightGamePiece);

// ABILITY

const wingsHoverF: AbilityHoverFunction = (source: Piece, state: GameState) => {
  clearHighlights(state);
  const location = getPieceLocation(source, state);
  for (let i = 0; i < state.board.length; i++) {
    for (let j = 0; j < state.board[i].length; j++) {
      const xDiff = Math.abs(j - location.col);
      const yDiff = Math.abs(i - location.row);
      const totalDiff = xDiff + yDiff;
      if (
        totalDiff > 0 &&
        xDiff < 3 &&
        yDiff < 3 &&
        state.board[i][j].inBounds &&
        state.board[i][j].piece.type === PieceType.empty
      ) {
        state.board[i][j].squareStatuses.push(SquareStatus.HL_POTENTIAL);
      }
    }
  }
};

const wingsAbilityF: AbilityFunction = (source: Piece, targetRow: number, targetCol: number, state: GameState) => {
  const abilityRuneCost = getAbilityRuneCost('wings_of_flesh');
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

  source.statuses.push(PieceStatus.WINGS);
  state.abilityActivatedFlag = true;

  // Subtract rune cost if ability successfully activated
  if (player === PlayerColour.light) {
    if (state.abilityActivatedFlag) state.lightRunes -= abilityRuneCost;
  } else {
    if (state.abilityActivatedFlag) state.darkRunes -= abilityRuneCost;
  }
  if (state.abilityActivatedFlag) clearAOEHighlights(state);
};

const WingsOfFlesh: Ability = {
  id: 'wings_of_flesh',
  name: 'Wings of Flesh',
  renderString: 'ability-wings_of_flesh',
  runeCost: 2,
  quick: true,
  immediate: true,
  hoverF: wingsHoverF,
  selectF: standardAbilitySelectF,
  abilityF: wingsAbilityF,
};

registerAbility(WingsOfFlesh);
