import { combineReducers } from 'redux';
import gameReducer from './slices/game/slice';
import UIReducer from './slices/ui/slice';

const rootReducer = combineReducers({
  game: gameReducer,
  ui: UIReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
