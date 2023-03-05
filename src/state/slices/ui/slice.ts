import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameJoinedEvent, GameCreatedEvent, PlayerJoinedGameEvent } from '../../../../../ws/events';
import { PlayerColour, UserInfo } from '../../../types';
import { GameState } from '../game/slice';

export enum AlertType {
  success = 'success',
  warning = 'warning',
  info = 'info',
  error = 'error',
}

export enum OnlineGameStatus {
  NONE,
  AWAITING,
  SUCCESS,
}

let alertCount = 0;
export const getAlertID = (): number => {
  alertCount++;
  return alertCount;
};

export interface Alert {
  type: AlertType;
  content: string;
  id: number;
}

export enum ChatItemType {
  MESSAGE = 0,
  GAME = 1,
}

export interface ChatItem {
  content: string;
  time: Date;
  origin: string;
  type: ChatItemType;
}

export interface UIState {
  alerts: Alert[];
  activeGame: boolean;
  onlineGameStatus: OnlineGameStatus;
  roomId: string;
  chatlog: ChatItem[];
  otherPlayers: UserInfo[];
  player: UserInfo;
  boardInversion: boolean;
  createGameMenuOpen: boolean;
  joinGameMenuOpen: boolean;
  createLocalGameMenuOpen: boolean;
  gameStartState: GameState | null;
  chatOpen: boolean;
}

const blankPlayer: UserInfo = {
  colour: PlayerColour.neutral,
  name: '',
  id: '',
};

const initialUIState: UIState = {
  alerts: [],
  activeGame: false,
  onlineGameStatus: OnlineGameStatus.NONE,
  roomId: '',
  chatlog: [],
  otherPlayers: [],
  player: blankPlayer,
  boardInversion: false,
  createGameMenuOpen: false,
  joinGameMenuOpen: false,
  createLocalGameMenuOpen: true,
  gameStartState: null,
  chatOpen: true,
};

const UISlice = createSlice({
  name: 'ui',
  initialState: initialUIState,
  reducers: {
    updateBoardInversion: (state: UIState, action: PayloadAction<boolean>) => {
      state.boardInversion = action.payload;
    },
    toggleBoardInversion: (state: UIState) => {
      state.boardInversion = !state.boardInversion;
    },
    toggleCreateLocalGameMenu: (state: UIState) => {
      state.createGameMenuOpen = false;
      state.joinGameMenuOpen = false;
      state.createLocalGameMenuOpen = !state.createLocalGameMenuOpen;
    },
    toggleCreateGameMenu: (state: UIState) => {
      state.createLocalGameMenuOpen = false;
      state.joinGameMenuOpen = false;
      state.createGameMenuOpen = !state.createGameMenuOpen;
    },
    toggleJoinGameMenu: (state: UIState) => {
      state.createLocalGameMenuOpen = false;
      state.createGameMenuOpen = false;
      state.joinGameMenuOpen = !state.joinGameMenuOpen;
    },
    closeAllMenus: (state: UIState) => {
      state.createGameMenuOpen = false;
      state.joinGameMenuOpen = false;
      state.createLocalGameMenuOpen = false;
    },
    addPlayer: (state: UIState, action: PayloadAction<UserInfo>) => {
      state.otherPlayers.push(action.payload);
    },
    removePlayer: (state: UIState, action: PayloadAction<UserInfo>) => {
      state.otherPlayers = state.otherPlayers.filter((a: UserInfo) => a.id !== action.payload.id);
    },
    updatePlayer: (state: UIState, action: PayloadAction<UserInfo>) => {
      state.player = action.payload;
    },
    swapLocalPlayer: (state: UIState) => {
      const next = state.otherPlayers.pop();
      if (next) {
        state.otherPlayers.push(state.player);
        state.player = next;
      }
    },
    clearPlayers: (state: UIState) => {
      state.otherPlayers = [];
      state.player = blankPlayer;
    },
    addAlert: (state: UIState, action: PayloadAction<Alert>) => {
      state.alerts.push(action.payload);
    },
    removeAlert: (state: UIState, action: PayloadAction<Alert>) => {
      state.alerts = state.alerts.filter((a: Alert) => a.id !== action.payload.id);
    },
    toggleActiveGame: (state: UIState, action: PayloadAction<boolean>) => {
      state.activeGame = action.payload;
    },
    createdOnlineGame: (state: UIState, action: PayloadAction<GameCreatedEvent>) => {
      state.onlineGameStatus = OnlineGameStatus.AWAITING;
      state.roomId = action.payload.gameId;
    },
    anotherPlayerJoinedGame: (state: UIState, action: PayloadAction<PlayerJoinedGameEvent>) => {
      state.otherPlayers.push(action.payload.player);
      state.onlineGameStatus = OnlineGameStatus.SUCCESS;
    },
    joinedOnlineGame: (state: UIState, action: PayloadAction<GameJoinedEvent>) => {
      state.onlineGameStatus = OnlineGameStatus.SUCCESS;
      state.roomId = action.payload.roomId;
      state.otherPlayers.push(...action.payload.otherPlayers);
    },
    addChatItemToLog: (state: UIState, action: PayloadAction<ChatItem>) => {
      state.chatlog.push(action.payload);
    },
    clearChatlog: (state: UIState, action: PayloadAction) => {
      state.chatlog = [];
    },
    updateGameStartState: (state: UIState, action: PayloadAction<GameState>) => {
      state.gameStartState = action.payload;
    },
    updateChatOpen: (state: UIState, action: PayloadAction<boolean>) => {
      state.chatOpen = action.payload;
    },
  },
});

export default UISlice.reducer;
export const {
  addAlert,
  removeAlert,
  toggleActiveGame,
  createdOnlineGame,
  addChatItemToLog,
  clearChatlog,
  joinedOnlineGame,
  updatePlayer,
  anotherPlayerJoinedGame,
  addPlayer,
  removePlayer,
  swapLocalPlayer,
  clearPlayers,
  updateBoardInversion,
  toggleBoardInversion,
  toggleCreateGameMenu,
  toggleJoinGameMenu,
  toggleCreateLocalGameMenu,
  updateGameStartState,
  closeAllMenus,
  updateChatOpen,
} = UISlice.actions;
