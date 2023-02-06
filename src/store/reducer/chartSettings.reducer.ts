import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  TRADE_COLOR_DIRECTIONS,
  TRADE_COLOR_PREFERENCE,
  TRADE_STYLE_SETTINGS,
} from "src/helpers/coreconstants";

const initialState = {
  styleSettings: TRADE_STYLE_SETTINGS.FRESH,
  colorPreference: TRADE_COLOR_PREFERENCE.GREEN_UP,
  colorDirection: {
    up: TRADE_COLOR_DIRECTIONS.UP,
    down: TRADE_COLOR_DIRECTIONS.DOWN,
  },
};

export const chartSettingsSlice = createSlice({
  name: "chartSettings",
  initialState,
  reducers: {
    setTradeStyleSettings: (
      state,
      action: PayloadAction<TRADE_STYLE_SETTINGS>
    ) => {
      return { ...state, styleSettings: action.payload };
    },
    setTradeColorPreference: (
      state,
      action: PayloadAction<TRADE_COLOR_PREFERENCE>
    ) => {
      if (action.payload === TRADE_COLOR_PREFERENCE.GREEN_UP) {
        return {
          ...state,
          colorPreference: action.payload,
          colorDirection: {
            up: TRADE_COLOR_DIRECTIONS.UP,
            down: TRADE_COLOR_DIRECTIONS.DOWN,
          },
        };
      }

      if (action.payload === TRADE_COLOR_PREFERENCE.GREEN_DOWN) {
        return {
          ...state,
          colorPreference: action.payload,
          colorDirection: {
            up: TRADE_COLOR_DIRECTIONS.DOWN,
            down: TRADE_COLOR_DIRECTIONS.UP,
          },
        };
      }
    },
  },
});

export const { setTradeStyleSettings, setTradeColorPreference } =
  chartSettingsSlice.actions;

export default chartSettingsSlice.reducer;
