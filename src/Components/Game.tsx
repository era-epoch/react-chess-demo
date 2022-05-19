import './Game.css';
import GameArea from './GameArea';
import LeftBar from './LeftBar';

const Game = (): JSX.Element => {
  return (
    <div className="game">
      {/* <LeftBar /> */}
      <GameArea />
    </div>
  );
};

export default Game;
