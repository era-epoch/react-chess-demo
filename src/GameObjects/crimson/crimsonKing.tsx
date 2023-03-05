import { faBolt, faChessKing } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import { capturePieceAtLocation, clearHighlights, movePiece } from '../../state/slices/game/helpers';
import { updateActiveAbility, resetSelection, clearAOE, selectSquare, GameState } from '../../state/slices/game/slice';
import {
  Piece,
  PlayerColour,
  Orientation,
  PieceIdentifier,
  PieceType,
  PieceOrigin,
  AbilityFunction,
  SquareStatus,
  AbilitySelectFunction,
  ResolutionEventType,
} from '../../types';
import { getCurrentPlayer, isPlayersTurn } from '../../util';
import { Ability, getAbilityName, getAbilityRuneCost, registerAbility } from '../ability';
import { basicKingMoveF, CastlingDetail, KingDetail } from '../basic/basicKing';
import { GamePiece, GamePieceDetailProps, getMoveF, registerGamePiece } from '../gamePiece';
import { genPID } from '../gameUtil';
import {
  standardOnDeathF,
  standardOnCaptureF,
  standardOnMovedF,
  standardOnTurnStartF,
  standardOnTurnEndF,
  standardAbilityHoverF,
} from '../standardFunctions';

export const CrimsonKing = (): Piece => {
  const piece: Piece = {
    owner: PlayerColour.neutral,
    nMoves: 0,
    orientation: Orientation.neutral,
    statuses: [],
    identifier: PieceIdentifier.crimsonKing,
    type: PieceType.king,
    origin: PieceOrigin.crimson,
    id: genPID(),
    name: 'Vereival',
  };
  return piece;
};

const CrimsonKingDetail = (props: GamePieceDetailProps): JSX.Element => {
  const activeAbility = useSelector((state: RootState) => state.game.activeAbility);
  const selectedCol = useSelector((state: RootState) => state.game.selectedCol);
  const selectedRow = useSelector((state: RootState) => state.game.selectedRow);
  const turn = useSelector((state: RootState) => state.game.turn);
  const player = useSelector((state: RootState) => state.ui.player);
  const abilityId = 'alacrity';
  const dispatch = useDispatch();
  const handleClick = () => {
    if (activeAbility === 'alacrity_chain') return;
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
    <div
      className={`detail ability ${activeAbility === abilityId || activeAbility === 'alacrity_chain' ? ' active' : ''}`}
      onClick={handleClick}
    >
      <div>
        <FontAwesomeIcon icon={faBolt} className="detail-icon rune" />
        <span className="detail-title">{getAbilityName(abilityId)}: </span>
        <span className="detail-info">
          Immediately capture an enemy piece that is threatening this piece and move to that square. If that square is
          also under threat, you can repeat this ability at no cost.
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

const CrimsonKingGamePiece: GamePiece = {
  identifier: PieceIdentifier.crimsonKing,
  moveF: basicKingMoveF,
  onDeathF: standardOnDeathF,
  onCaptureF: standardOnCaptureF,
  onMovedF: standardOnMovedF,
  onTurnStartF: standardOnTurnStartF,
  onTurnEndF: standardOnTurnEndF,
  details: [CrimsonKingDetail, KingDetail, CastlingDetail],
  icon: faChessKing,
};

registerGamePiece(CrimsonKingGamePiece);

// ABILITY

const alacritySelectF: AbilitySelectFunction = (source: Piece, state: GameState) => {
  console.log('alaSelect');
  clearHighlights(state);
  for (let i = 0; i < state.board.length; i++) {
    for (let j = 0; j < state.board[i].length; j++) {
      const piece = state.board[i][j].piece;
      if (piece.owner === source.owner) continue;
      const moveF = getMoveF(piece.identifier);
      if (!moveF) continue;
      const moves = moveF(piece, i, j, state, true);
      for (let k = 0; k < moves.length; k++) {
        if (moves[k].col === state.selectedCol && moves[k].row === state.selectedRow) {
          state.board[i][j].squareStatuses.push(...[SquareStatus.QUICK_KILL]);
        }
      }
    }
  }
};

const alacrityChainSelectF: AbilitySelectFunction = (source: Piece, state: GameState) => {
  state.postTurnResolutionQueue.shift();
  clearHighlights(state);
  for (let i = 0; i < state.board.length; i++) {
    for (let j = 0; j < state.board[i].length; j++) {
      const piece = state.board[i][j].piece;
      if (piece.owner === source.owner) continue;
      const moveF = getMoveF(piece.identifier);
      if (!moveF) continue;
      const moves = moveF(piece, i, j, state, true);
      for (let k = 0; k < moves.length; k++) {
        if (moves[k].col === state.selectedCol && moves[k].row === state.selectedRow) {
          state.board[i][j].squareStatuses.push(...[SquareStatus.QUICK_KILL]);
        }
      }
    }
  }
};
const alacrityAbilityF: AbilityFunction = (source: Piece, targetRow: number, targetCol: number, state: GameState) => {
  alacrityAbilityBase(source, targetRow, targetCol, state, 'alacrity');
};

const alacrityChainAbilityF: AbilityFunction = (
  source: Piece,
  targetRow: number,
  targetCol: number,
  state: GameState,
) => {
  alacrityAbilityBase(source, targetRow, targetCol, state, 'alacrity_chain');
};

const alacrityAbilityBase = (
  source: Piece,
  targetRow: number,
  targetCol: number,
  state: GameState,
  variant: string,
) => {
  const abilityRuneCost = getAbilityRuneCost(variant);
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
  if (state.board[targetRow][targetCol].squareStatuses.includes(SquareStatus.QUICK_KILL)) {
    // capture
    capturePieceAtLocation(state, targetRow, targetCol, source);
    movePiece(state, source, { row: targetRow, col: targetCol, flags: [] });
    state.abilityActivatedFlag = true;
    let repeat = false;
    for (let i = 0; i < state.board.length; i++) {
      for (let j = 0; j < state.board[i].length; j++) {
        const piece = state.board[i][j].piece;
        if (piece.owner === source.owner) continue;
        const moveF = getMoveF(piece.identifier);
        if (!moveF) continue;
        const moves = moveF(piece, i, j, state, true);
        for (let k = 0; k < moves.length; k++) {
          if (moves[k].col === state.selectedCol && moves[k].row === state.selectedRow) {
            repeat = true;
            break;
          }
        }
      }
    }
    console.log('repeat ', repeat);
    if (repeat) state.postTurnResolutionQueue.push({ type: ResolutionEventType.AlacrityChain, source: source });
  }

  // Subtract rune cost if ability successfully activated
  if (player === PlayerColour.light) {
    if (state.abilityActivatedFlag) state.lightRunes -= abilityRuneCost;
  } else {
    if (state.abilityActivatedFlag) state.darkRunes -= abilityRuneCost;
  }
};

const Alacrity: Ability = {
  id: 'alacrity',
  name: 'Alacrity',
  renderString: 'ability-alacrity',
  runeCost: 15,
  quick: false,
  immediate: false,
  hoverF: standardAbilityHoverF,
  selectF: alacritySelectF,
  abilityF: alacrityAbilityF,
};

registerAbility(Alacrity);

const AlacrityChain: Ability = {
  id: 'alacrity_chain',
  name: 'Alacrity',
  renderString: 'ability-alacrity',
  runeCost: 0,
  quick: false,
  immediate: false,
  hoverF: standardAbilityHoverF,
  selectF: alacrityChainSelectF,
  abilityF: alacrityChainAbilityF,
};

registerAbility(AlacrityChain);
