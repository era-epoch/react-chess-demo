import { faChessPawn, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GameState } from '../../state/slices/game/slice';
import {
  Piece,
  PlayerColour,
  Orientation,
  PieceType,
  PieceIdentifier,
  PieceOrigin,
  DeathFunction,
  PieceStatus,
} from '../../types';
import { basicPawnMoveF, EnPassantDetail, PawnDetail, PromotionDetail } from '../basic/basicPawn';
import { GamePiece, registerGamePiece } from '../gamePiece';
import { genPID } from '../gameUtil';
import {
  standardOnCaptureF,
  standardOnDeathF,
  standardOnMovedF,
  standardOnTurnEndF,
  standardOnTurnStartF,
} from '../standardFunctions';

export const ScourgePawn = (): Piece => {
  const piece: Piece = {
    owner: PlayerColour.neutral,
    nMoves: 0,
    orientation: Orientation.neutral,
    statuses: [],
    type: PieceType.pawn,
    identifier: PieceIdentifier.scourgePawn,
    origin: PieceOrigin.scourge,
    id: genPID(),
    name: 'Infected Rat',
  };
  return piece;
};

export const scourgePawnOnDeathF: DeathFunction = (
  piece: Piece,
  row: number,
  col: number,
  state: GameState,
  capturer?: Piece,
) => {
  if (capturer) {
    capturer.statuses.push(PieceStatus.PSN);
    standardOnDeathF(piece, row, col, state, capturer);
  } else {
    standardOnDeathF(piece, row, col, state);
  }
};

export const ScourgePawnDetail = (): JSX.Element => {
  return (
    <div className="detail text-detail">
      <div>
        <FontAwesomeIcon icon={faStar} className="detail-icon" />
        <span className="detail-title">Lesser Posthumous Transmission: </span>
        <span className="detail-info">
          When this piece is captured, the capturing piece gains one stack of{' '}
          <span className="emph poison-text">poisoned</span>.
        </span>
      </div>
    </div>
  );
};

const ScourgePawnGamePiece: GamePiece = {
  identifier: PieceIdentifier.scourgePawn,
  moveF: basicPawnMoveF,
  onDeathF: scourgePawnOnDeathF,
  onCaptureF: standardOnCaptureF,
  onMovedF: standardOnMovedF,
  onTurnStartF: standardOnTurnStartF,
  onTurnEndF: standardOnTurnEndF,
  details: [ScourgePawnDetail, PawnDetail, EnPassantDetail, PromotionDetail],
  icon: faChessPawn,
};

registerGamePiece(ScourgePawnGamePiece);
