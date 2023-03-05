import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import GameArea from '../GameArea/GameArea';
import LeftBar from '../LeftBar/LeftBar';
import CreateLocalMenu from '../Menus/CreateLocalMenu/CreateLocalMenu';
import CreateOnlineMenu from '../Menus/CreateOnlineMenu/CreateOnlineMenu';
import JoinMenu from '../Menus/JoinMenu/JoinMenu';
import './Base.css';
import '../Menus/Menus.css';

const Base = (): JSX.Element => {
  const activeGame = useSelector((state: RootState) => state.ui.activeGame);
  const createOnlineMenuOpen = useSelector((state: RootState) => state.ui.createGameMenuOpen);
  const joinGameMenuOpen = useSelector((state: RootState) => state.ui.joinGameMenuOpen);
  const createLocalMenuOpen = useSelector((state: RootState) => state.ui.createLocalGameMenuOpen);

  return (
    <div className="base">
      <LeftBar />
      {activeGame ? <GameArea /> : null}
      {createOnlineMenuOpen ? (
        <CreateOnlineMenu />
      ) : joinGameMenuOpen ? (
        <JoinMenu />
      ) : createLocalMenuOpen ? (
        <CreateLocalMenu />
      ) : null}
    </div>
  );
};

export default Base;
