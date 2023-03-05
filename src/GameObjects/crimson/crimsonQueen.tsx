import { faBolt, faChessQueen, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import {
  capturePieceAtLocation,
  clearAOEHighlights,
  clearHighlights,
  movePiece,
} from '../../state/slices/game/helpers';
import {
  clearAOE,
  GameState,
  hoverActiveAbility,
  resetSelection,
  selectSquare,
  updateActiveAbility,
} from '../../state/slices/game/slice';
import {
  Piece,
  PlayerColour,
  Orientation,
  PieceIdentifier,
  PieceType,
  PieceOrigin,
  CaptureFunction,
  SquareStatus,
  MoveFunction,
  Move,
  MoveFlag,
  AbilityHoverFunction,
  AbilityFunction,
} from '../../types';
import { getCurrentPlayer, isPlayersTurn } from '../../util';
import { Ability, getAbilityName, getAbilityRuneCost, registerAbility } from '../ability';
import { QueenDetail } from '../basic/basicQueen';
import { GamePiece, GamePieceDetailProps, registerGamePiece } from '../gamePiece';
import { filterMoves, genPID } from '../gameUtil';
import {
  standardAbilitySelectF,
  standardOnCaptureF,
  standardOnDeathF,
  standardOnMovedF,
  standardOnTurnEndF,
  standardOnTurnStartF,
} from '../standardFunctions';

export const CrimsonQueen = (): Piece => {
  const piece: Piece = {
    owner: PlayerColour.neutral,
    nMoves: 0,
    orientation: Orientation.neutral,
    statuses: [],
    identifier: PieceIdentifier.crimsonQueen,
    type: PieceType.queen,
    origin: PieceOrigin.crimson,
    id: genPID(),
    name: 'Bloodmage',
  };
  return piece;
};

const crimsonQueenMoveF: MoveFunction = (
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
  i = 1;
  while (
    row + i < board.length &&
    col + i < board[0].length &&
    board[row + i][col + i].piece.type === PieceType.empty
  ) {
    moves.push({ row: row + i, col: col + i, oRow: row, oCol: col, flags: [] });
    i++;
  }
  if (row + i < board.length && col + i < board[0].length) {
    moves.push({ row: row + i, col: col + i, flags: [MoveFlag.KILL], oRow: row, oCol: col });
  }
  i = 1;
  while (row + i < board.length && col - i >= 0 && board[row + i][col - i].piece.type === PieceType.empty) {
    moves.push({ row: row + i, col: col - i, oRow: row, oCol: col, flags: [] });
    i++;
  }
  if (row + i < board.length && col - i >= 0) {
    moves.push({ row: row + i, col: col - i, flags: [MoveFlag.KILL], oRow: row, oCol: col });
  }
  i = 1;
  while (row - i >= 0 && col - i >= 0 && board[row - i][col - i].piece.type === PieceType.empty) {
    moves.push({ row: row - i, col: col - i, oRow: row, oCol: col, flags: [] });
    i++;
  }
  if (row - i >= 0 && col - i >= 0) {
    moves.push({ row: row - i, col: col - i, flags: [MoveFlag.KILL], oRow: row, oCol: col });
  }
  i = 1;
  while (row - i >= 0 && col + i < board[0].length && board[row - i][col + i].piece.type === PieceType.empty) {
    moves.push({ row: row - i, col: col + i, oRow: row, oCol: col, flags: [] });
    i++;
  }
  if (row - i >= 0 && col + i < board[0].length) {
    moves.push({ row: row - i, col: col + i, flags: [MoveFlag.KILL], oRow: row, oCol: col });
  }
  return filterMoves(piece, row, col, state, moves, checkKing);
};

const crimsonQueenOnCaptureF: CaptureFunction = (
  piece: Piece,
  row: number,
  col: number,
  state: GameState,
  target: Piece,
) => {
  state.board[row][col].squareStatuses.push(SquareStatus.BLOODIED);
  standardOnCaptureF(piece, row, col, state, target);
};

const CrimsonQueenDetail = (props: GamePieceDetailProps): JSX.Element => {
  return (
    <div className="detail text-detail">
      <div>
        <FontAwesomeIcon icon={faStar} className="detail-icon" />
        <span className="detail-title">Spill Viscera: </span>
        <span className="detail-info">
          This piece can capture friendly pieces. Whenever this piece captures another, the square that piece was on
          becomes <span className="emph blood">bloodied</span>.
        </span>
      </div>
    </div>
  );
};

const CrimsonQueenAbilityDetail = (props: GamePieceDetailProps): JSX.Element => {
  const activeAbility = useSelector((state: RootState) => state.game.activeAbility);
  const selectedCol = useSelector((state: RootState) => state.game.selectedCol);
  const selectedRow = useSelector((state: RootState) => state.game.selectedRow);
  const turn = useSelector((state: RootState) => state.game.turn);
  const player = useSelector((state: RootState) => state.ui.player);
  const [selected, setSelected] = useState(false);
  const abilityId = 'hemoport';
  const dispatch = useDispatch();
  const handleClick = () => {
    if (props.piece && player.colour === props.piece.owner && isPlayersTurn(turn, player)) {
      setSelected(!selected);
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
      selectedRow &&
      !selected
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
          (Quick) This piece can move to any <span className="emph blood">bloodied</span> square this turn.
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

const CrimsonQueenGamePiece: GamePiece = {
  identifier: PieceIdentifier.crimsonQueen,
  moveF: crimsonQueenMoveF,
  onDeathF: standardOnDeathF,
  onCaptureF: crimsonQueenOnCaptureF,
  onMovedF: standardOnMovedF,
  onTurnStartF: standardOnTurnStartF,
  onTurnEndF: standardOnTurnEndF,
  details: [CrimsonQueenDetail, CrimsonQueenAbilityDetail, QueenDetail],
  icon: faChessQueen,
};

registerGamePiece(CrimsonQueenGamePiece);

// ABILITY

const hemoportHoverF: AbilityHoverFunction = (source: Piece, state: GameState) => {
  clearHighlights(state);
  for (let i = 0; i < state.board.length; i++) {
    for (let j = 0; j < state.board[i].length; j++) {
      if (state.board[i][j].squareStatuses.includes(SquareStatus.BLOODIED)) {
        state.board[i][j].squareStatuses.push(...[SquareStatus.AOE, SquareStatus.AOE_BLOOD]);
      }
    }
  }
};

const hemoportAbilityF: AbilityFunction = (source: Piece, targetRow: number, targetCol: number, state: GameState) => {
  const abilityRuneCost = getAbilityRuneCost('hemoport');
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

  if (state.board[targetRow][targetCol].squareStatuses.includes(SquareStatus.BLOODIED)) {
    capturePieceAtLocation(state, targetRow, targetCol, source);
    movePiece(state, source, { row: targetRow, col: targetCol, flags: [] });
    state.abilityActivatedFlag = true;
  }

  // Subtract rune cost if ability successfully activated
  if (player === PlayerColour.light) {
    if (state.abilityActivatedFlag) state.lightRunes -= abilityRuneCost;
  } else {
    if (state.abilityActivatedFlag) state.darkRunes -= abilityRuneCost;
  }
  if (state.abilityActivatedFlag) clearAOEHighlights(state);
};

const Hemoport: Ability = {
  id: 'hemoport',
  name: 'Hemoport',
  renderString: 'ability-hemoport',
  runeCost: 1,
  quick: false,
  immediate: true,
  hoverF: hemoportHoverF,
  selectF: standardAbilitySelectF,
  abilityF: hemoportAbilityF,
};

registerAbility(Hemoport);
