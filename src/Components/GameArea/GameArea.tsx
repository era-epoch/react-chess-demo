import './GameArea.css';
import GameAreaInfo from './GameAreaInfo/GameAreaInfo';
import GameAreaMain from './GameAreaMain/GameAreaMain';

const GameArea = (): JSX.Element => {
  return (
    <div className="game-area">
      <GameAreaMain />
      <GameAreaInfo />
    </div>
  );
};

export default GameArea;
