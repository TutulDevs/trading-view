import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TRADE_COLOR_DIRECTIONS,
  TRADE_COLOR_PREFERENCE,
  TRADE_COLOR_PREFERENCE_TEXT,
  TRADE_STYLE_SETTINGS,
} from "src/helpers/coreconstants";
import { RootState } from "src/store";
import { setTradeColorPreference, setTradeStyleSettings } from "src/store/reducer/chartSettings.reducer";

export const useSettings = () => {
  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);

  const { styleSettings, colorPreference } = useSelector(
    (state: RootState) => state.chartSettings
  );

  const onStyleSettingsChange = (value: TRADE_STYLE_SETTINGS) =>
    dispatch(setTradeStyleSettings(value));

  const styleSettingsOptions = [
    {
      value: TRADE_STYLE_SETTINGS.FRESH,
      title: "Fresh",
      colors: ["p4", "p3"],
    },
    {
      value: TRADE_STYLE_SETTINGS.TRADITIONAL,
      title: "Traditional",
      colors: ["t1", "t2"],
    },

    {
      value: TRADE_STYLE_SETTINGS.COLOR_VISION_DEFICIENCY,
      title: "Color Vision Deficiency",
      colors: ["cvd1", "cvd2"],
    },
  ];

  const colorPreferenceOptions = [
    {
      value: TRADE_COLOR_PREFERENCE.GREEN_UP,
      title: TRADE_COLOR_PREFERENCE_TEXT[TRADE_COLOR_PREFERENCE.GREEN_UP],
      colors: [TRADE_COLOR_DIRECTIONS.UP, TRADE_COLOR_DIRECTIONS.DOWN],
    },
    {
      value: TRADE_COLOR_PREFERENCE.GREEN_DOWN,
      title: TRADE_COLOR_PREFERENCE_TEXT[TRADE_COLOR_PREFERENCE.GREEN_DOWN],
      colors: [TRADE_COLOR_DIRECTIONS.DOWN, TRADE_COLOR_DIRECTIONS.UP],
    },
  ];

  const handleColorPrefChange = (v: TRADE_COLOR_PREFERENCE) =>
    dispatch(setTradeColorPreference(v));

  return {
    visible,
    setVisible,
    styleSettings,
    onStyleSettingsChange,
    styleSettingsOptions,
    colorPreferenceOptions,
    colorPreference,
    handleColorPrefChange,
  };
};
