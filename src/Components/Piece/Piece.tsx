import { faDroplet, faSkullCrossbones } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { uid } from 'react-uid';
import { getIcon } from '../../GameObjects/gamePiece';
import { Piece, PieceStatus, PlayerColour } from '../../types';
import './Piece.css';

interface Props {
  piece: Piece;
}

const BoardPiece = (props: Props): JSX.Element => {
  const icon = getIcon(props.piece.identifier);
  return (
    <div className="icon-wrapper">
      {icon !== null ? (
        <FontAwesomeIcon
          icon={icon}
          className={`${props.piece.owner === PlayerColour.dark ? 'dark-piece' : 'light-piece'} ${props.piece.origin}`}
        />
      ) : null}
      <div className="statuses">
        {props.piece.statuses.map((s: PieceStatus, i) => {
          if (s === PieceStatus.PSN) {
            return <FontAwesomeIcon key={uid(i)} icon={faSkullCrossbones} className="poison" />;
          } else if (s === PieceStatus.bloodthirsty) {
            return <FontAwesomeIcon key={uid(i)} icon={faDroplet} className="blood" />;
          } else {
            return null;
          }
        })}
      </div>
    </div>
  );
};

export default BoardPiece;
