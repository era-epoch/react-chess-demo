import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum AlertType {
  success = 'success',
  warning = 'warning',
  info = 'info',
  error = 'error',
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

export interface UIState {
  alerts: Alert[];
}

// const testAlerts = [
//   { type: AlertType.success, content: 'successsssssssssssssssssssssssssssssssssssssssssssssssssssssss', id: -1 },
//   { type: AlertType.warning, content: 'warning', id: -2 },
//   { type: AlertType.info, content: 'info', id: -3 },
//   { type: AlertType.error, content: 'error', id: -4 },
// ];

const initialUIState = {
  alerts: [],
};

const UISlice = createSlice({
  name: 'ui',
  initialState: initialUIState,
  reducers: {
    addAlert: (state: UIState, action: PayloadAction<Alert>) => {
      state.alerts.push(action.payload);
    },
    removeAlert: (state: UIState, action: PayloadAction<Alert>) => {
      state.alerts = state.alerts.filter((a: Alert) => a.id !== action.payload.id);
    },
  },
});

export default UISlice.reducer;
export const { addAlert, removeAlert } = UISlice.actions;
