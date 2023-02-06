import { useSelector } from "react-redux";
import {
  TRADE_COLOR_DIRECTIONS,
  TRADE_COLOR_PREFERENCE,
  TRADE_STYLE_SETTINGS,
} from "src/helpers/coreconstants";
import { RootState } from "src/store";
import colors from "../../styles/colors.module.sass";

export const useTradeColors = () => {
  const { styleSettings, colorDirection, colorPreference } = useSelector(
    (state: RootState) => state.chartSettings
  );

  const handleTradeColors = (type: TRADE_COLOR_DIRECTIONS): string => {
    return `tradePrice_${styleSettings}_${
      type === TRADE_COLOR_DIRECTIONS.UP
        ? colorDirection.up
        : type === TRADE_COLOR_DIRECTIONS.DOWN
        ? colorDirection.down
        : type === TRADE_COLOR_DIRECTIONS.DEFAULT
    }`;
  };

  const handleTradeBackground = (type: TRADE_COLOR_DIRECTIONS): string => {
    return `tradePriceBg_${styleSettings}_${
      type === TRADE_COLOR_DIRECTIONS.UP
        ? colorDirection.up
        : type === TRADE_COLOR_DIRECTIONS.DOWN
        ? colorDirection.down
        : type === TRADE_COLOR_DIRECTIONS.DEFAULT
    }`;
  };

  const getTVColor = (type: "up" | "down"): string => {
    let cc = ""; // colorCode

    if (type === "up") {
      if (styleSettings === TRADE_STYLE_SETTINGS.FRESH) {
        cc =
          colorPreference == TRADE_COLOR_PREFERENCE.GREEN_UP
            ? colors.p4
            : colors.p3;
      }

      if (styleSettings === TRADE_STYLE_SETTINGS.TRADITIONAL) {
        cc =
          colorPreference == TRADE_COLOR_PREFERENCE.GREEN_UP
            ? colors.t1
            : colors.t2;
      }

      if (styleSettings === TRADE_STYLE_SETTINGS.COLOR_VISION_DEFICIENCY) {
        cc =
          colorPreference == TRADE_COLOR_PREFERENCE.GREEN_UP
            ? colors.cvd1
            : colors.cvd2;
      }
    }

    if (type === "down") {
      if (styleSettings === TRADE_STYLE_SETTINGS.FRESH) {
        cc =
          colorPreference == TRADE_COLOR_PREFERENCE.GREEN_UP
            ? colors.p3
            : colors.p4;
      }

      if (styleSettings === TRADE_STYLE_SETTINGS.TRADITIONAL) {
        cc =
          colorPreference == TRADE_COLOR_PREFERENCE.GREEN_UP
            ? colors.t2
            : colors.t1;
      }

      if (styleSettings === TRADE_STYLE_SETTINGS.COLOR_VISION_DEFICIENCY) {
        cc =
          colorPreference == TRADE_COLOR_PREFERENCE.GREEN_UP
            ? colors.cvd2
            : colors.cvd1;
      }
    }

    return cc;
  };

  return { handleTradeColors, handleTradeBackground, getTVColor };
};
