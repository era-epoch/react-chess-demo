import { faBolt, faChessRook } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import { clearAOEHighlights, clearHighlights } from '../../state/slices/game/helpers';
import { GameState, updateActiveAbility, selectSquare, resetSelection, clearAOE } from '../../state/slices/game/slice';
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
} from '../../types';
import { getCurrentPlayer, getPieceLocation, isPlayersTurn } from '../../util';
import { Ability, getAbilityName, getAbilityRuneCost, registerAbility } from '../ability';
import { basicRookMoveF, RookDetail } from '../basic/basicRook';
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

export const ScourgeRook = (): Piece => {
  const piece: Piece = {
    owner: PlayerColour.neutral,
    nMoves: 0,
    orientation: Orientation.neutral,
    statuses: [],
    identifier: PieceIdentifier.scourgeRook,
    type: PieceType.rook,
    origin: PieceOrigin.scourge,
    id: genPID(),
    name: 'Fetid Tower',
  };
  return piece;
};

const ScourgeRookDetail = (props: GamePieceDetailProps): JSX.Element => {
  const activeAbility = useSelector((state: RootState) => state.game.activeAbility);
  const selectedCol = useSelector((state: RootState) => state.game.selectedCol);
  const selectedRow = useSelector((state: RootState) => state.game.selectedRow);
  const turn = useSelector((state: RootState) => state.game.turn);
  const player = useSelector((state: RootState) => state.ui.player);
  const abilityId = 'infect';
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
          dispatch(clearAOE());
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
          <span className="emph poison-text">Poison</span> any piece within 2 squares of this piece.
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

const ScourgeRookGamePiece: GamePiece = {
  identifier: PieceIdentifier.scourgeRook,
  moveF: basicRookMoveF,
  onDeathF: standardOnDeathF,
  onCaptureF: standardOnCaptureF,
  onMovedF: standardOnMovedF,
  onTurnStartF: standardOnTurnStartF,
  onTurnEndF: standardOnTurnEndF,
  details: [ScourgeRookDetail, RookDetail],
  icon: faChessRook,
};

registerGamePiece(ScourgeRookGamePiece);

// ABILITIES

const infectSelectF: AbilitySelectFunction = (source: Piece, state: GameState) => {
  clearHighlights(state);
  // AOE Effect Highlights
  if (state.selectedRow && state.selectedCol) {
    const row = state.selectedRow;
    const col = state.selectedCol;
    for (let i = 0; i < state.board.length; i++) {
      for (let j = 0; j < state.board[i].length; j++) {
        const xDiff = Math.abs(j - col);
        const yDiff = Math.abs(i - row);
        if (xDiff < 3 && yDiff < 3 && xDiff + yDiff > 0 && state.board[i][j].inBounds) {
          state.board[i][j].squareStatuses.push(...[SquareStatus.AOE, SquareStatus.AOE_PSN]);
        }
      }
    }
  }
};

const infectAbilityF: AbilityFunction = (source: Piece, targetRow: number, targetCol: number, state: GameState) => {
  const abilityRuneCost = getAbilityRuneCost('infect');
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
  const yDiff = Math.abs(targetRow - sourceLocation.row);
  const xDiff = Math.abs(targetCol - sourceLocation.col);
  if (yDiff < 3 && xDiff < 3 && yDiff + xDiff > 0) {
    if (state.board[targetRow][targetCol].piece.type !== PieceType.empty) {
      state.board[targetRow][targetCol].piece.statuses.push(PieceStatus.PSN);
      state.abilityActivatedFlag = true;
    }
  }

  // Subtract rune cost if ability successfully activated
  if (player === PlayerColour.light) {
    if (state.abilityActivatedFlag) state.lightRunes -= abilityRuneCost;
  } else {
    if (state.abilityActivatedFlag) state.darkRunes -= abilityRuneCost;
  }
  if (state.abilityActivatedFlag) clearAOEHighlights(state);
};

const InfectAbility: Ability = {
  id: 'infect',
  name: 'Infect',
  renderString: 'ability-infect',
  runeCost: 1,
  quick: false,
  immediate: false,
  hoverF: standardAbilityHoverF,
  selectF: infectSelectF,
  abilityF: infectAbilityF,
};

registerAbility(InfectAbility);
