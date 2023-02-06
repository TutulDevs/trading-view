import { configureStore } from "@reduxjs/toolkit";
import chartSettingsSlice from "./reducer/chartSettings.reducer";

export const store = configureStore({
  reducer: {
    chartSettings: chartSettingsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
