import { faDroplet, faSkullCrossbones, faSyringe } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GamePieceDetailProps } from '../../GameObjects/gamePiece';
import { PieceStatus } from '../../types';
import './details.css';

const Poisoned = (props: GamePieceDetailProps): JSX.Element => {
  return (
    <div className="detail text-detail">
      <div className="detail-section">
        <FontAwesomeIcon icon={faSkullCrossbones} className="detail-icon poison" />
        <span className="detail-title">Poisoned: </span>
        <span className="detail-info">
          If your piece has 3 or more stacks of <span className="emph poison-text">poisoned</span> at the end of your
          turn, it dies.
        </span>
      </div>
    </div>
  );
};

const Bloodthirsty = (props: GamePieceDetailProps): JSX.Element => {
  return (
    <div className="detail text-detail">
      <div className="detail-section">
        <FontAwesomeIcon icon={faDroplet} className="detail-icon blood" />
        <span className="detail-title">Bloodthirsty: </span>
        <span className="detail-info">The next time this piece moves, it can capture by moving one space forward.</span>
      </div>
    </div>
  );
};

const Immune = (props: GamePieceDetailProps): JSX.Element => {
  return (
    <div className="detail text-detail">
      <div className="detail-section">
        <FontAwesomeIcon icon={faSyringe} className="detail-icon immune" />
        <span className="detail-title">Immune: </span>
        <span className="detail-info">
          This piece cannot die from <span className="emph poison-text">poison</span>.
        </span>
      </div>
    </div>
  );
};

export const statusInfoMap = new Map<PieceStatus, React.FC<GamePieceDetailProps>[]>([
  [PieceStatus.PSN, [Poisoned]],
  [PieceStatus.bloodthirsty, [Bloodthirsty]],
  [PieceStatus.immune, [Immune]],
]);
