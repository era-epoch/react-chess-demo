import { combineReducers } from 'redux';
import gameReducer from './slices/gameSlice/slice';
import UIReducer from './slices/UISlice/slice';

const rootReducer = combineReducers({
  game: gameReducer,
  ui: UIReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
