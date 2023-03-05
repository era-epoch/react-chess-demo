import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { uid } from 'react-uid';
import { getIcon } from '../../../GameObjects/gamePiece';
import { Board, PlayerColour } from '../../../types';

interface Props {
  board: Board;
}

const BoardPreview = (props: Props): JSX.Element => {
  const board = props.board;
  return (
    <div className="board-preview">
      {board.map((row, n) => {
        return (
          <div className="board-preview-row" key={uid(n)}>
            {row.map((square, m) => {
              const icon = getIcon(square.piece.identifier);
              return (
                <div
                  className={
                    `board-preview-square ${(n + m) % 2 === 0 ? ' light-square' : ' dark-square'}` +
                    `${square.inBounds ? ' ' : ' inactive-square'}`
                  }
                  key={uid(m)}
                >
                  {icon !== null ? (
                    <FontAwesomeIcon
                      icon={icon}
                      className={`${square.piece.owner === PlayerColour.dark ? 'dark-piece' : 'light-piece'} ${
                        square.piece.origin
                      }`}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default BoardPreview;
