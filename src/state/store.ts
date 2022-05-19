import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { enableMapSet } from 'immer';

const composedEnhancer = composeWithDevTools(applyMiddleware(thunk));

enableMapSet();

export const store = createStore(rootReducer, composedEnhancer);