import { faChessQueen, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GameState } from '../../state/slices/game/slice';
import {
  Piece,
  PlayerColour,
  Orientation,
  PieceIdentifier,
  PieceType,
  PieceOrigin,
  CaptureFunction,
  PieceStatus,
  DeathFunction,
} from '../../types';
import { basicQueenMoveF, QueenDetail } from '../basic/basicQueen';
import { GamePiece, GamePieceDetailProps, registerGamePiece } from '../gamePiece';
import { genPID } from '../gameUtil';
import {
  standardOnCaptureF,
  standardOnDeathF,
  standardOnMovedF,
  standardOnTurnEndF,
  standardOnTurnStartF,
} from '../standardFunctions';

export const ScourgeQueen = (): Piece => {
  const piece: Piece = {
    owner: PlayerColour.neutral,
    nMoves: 0,
    orientation: Orientation.neutral,
    statuses: [PieceStatus.immune],
    identifier: PieceIdentifier.scourgeQueen,
    type: PieceType.queen,
    origin: PieceOrigin.scourge,
    id: genPID(),
    name: 'Vengeful Mutation',
  };
  return piece;
};

const scourgeQueenOnCaptureF: CaptureFunction = (
  piece: Piece,
  row: number,
  col: number,
  state: GameState,
  target: Piece,
) => {
  piece.statuses.push(PieceStatus.PSN);
  standardOnCaptureF(piece, row, col, state, target);
};

const scourgeQueenOnDeathF: DeathFunction = (
  piece: Piece,
  row: number,
  col: number,
  state: GameState,
  capturer?: Piece,
): void => {
  if (capturer) {
    let poisonStacks = 0;
    for (let i = 0; i < piece.statuses.length; i++) {
      if (piece.statuses[i] === PieceStatus.PSN) {
        poisonStacks++;
      }
    }
    for (let i = 0; i < poisonStacks; i++) {
      capturer.statuses.push(PieceStatus.PSN);
    }
  }
  standardOnDeathF(piece, row, col, state, capturer);
};

const ScourgeQueenDetail = (props: GamePieceDetailProps): JSX.Element => {
  return (
    <div className="detail text-detail">
      <div>
        <FontAwesomeIcon icon={faStar} className="detail-icon" />
        <span className="detail-title">Greater Posthumous Transmission: </span>
        <span className="detail-info">
          This piece cannot die from <span className="emph poison-text">poison</span>. Whenever this piece captures
          another piece, gain 1 stack of <span className="emph poison-text">poisoned</span>. When this piece is
          captured, immediately transfer all stacks of <span className="emph poison-text">poisoned</span> from this
          piece to the capturing piece.
        </span>
      </div>
    </div>
  );
};

const ScourgeQueenGamePiece: GamePiece = {
  identifier: PieceIdentifier.scourgeQueen,
  moveF: basicQueenMoveF,
  onDeathF: scourgeQueenOnDeathF,
  onCaptureF: scourgeQueenOnCaptureF,
  onMovedF: standardOnMovedF,
  onTurnStartF: standardOnTurnStartF,
  onTurnEndF: standardOnTurnEndF,
  details: [ScourgeQueenDetail, QueenDetail],
  icon: faChessQueen,
};

registerGamePiece(ScourgeQueenGamePiece);
