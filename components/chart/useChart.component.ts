import { useRouter } from "next/router";
import {
  ChartingLibraryWidgetOptions,
  LanguageCode,
  ResolutionString,
} from "public/lib/trading_view/charting_library/charting_library";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { TRADING_VIEW_DEFAULTS } from "src/globalTypes";
import { datafeed_dummy } from "src/helpers/trading_view/trading_view.datafeed";
import {
  DISABLED_FEATURES,
  ENABLED_FEATURES,
  trading_view_languages,
  widgetOptionsDefault,
} from "src/helpers/trading_view/trading_view.helpers";
import { useTradeColors } from "src/hooks/useTradeColors";
import { useTradingView } from "src/hooks/useTradingView";
import { RootState } from "src/store";
import useDarkMode from "use-dark-mode";
import colors from "../../styles/colors.module.sass";

export const useChart = () => {
  const container_id = TRADING_VIEW_DEFAULTS.CONTAINER_ID_SPOT;
  const containerRef = useRef<HTMLElement>(null);

  const router = useRouter();
  const coinPair = router.query?.pair;
  const baseCoin = typeof coinPair == "string" && coinPair?.split("_")[0];
  const tradeCoin = typeof coinPair == "string" && coinPair?.split("_")[1];

  const { value: darkModeStatus } = useDarkMode(false);
  const isTablet = useMediaQuery({
    query: `(max-width: ${TRADING_VIEW_DEFAULTS.PRESET_WIDTH}px)`,
  });
  const { styleSettings: s, colorPreference: p } = useSelector(
    (state: RootState) => state.chartSettings
  );
  const { getTVColor } = useTradeColors();

  const applyOverrides = {
    "paneProperties.background": darkModeStatus ? colors.black1 : colors.white,
    "paneProperties.backgroundType": "solid", // solid  | gradient

    "paneProperties.vertGridProperties.color": darkModeStatus
      ? colors.n3
      : colors.white1,
    "paneProperties.horzGridProperties.color": darkModeStatus
      ? colors.n3
      : colors.white1,
    "scalesProperties.textColor": darkModeStatus ? colors.n8 : colors.n1, // symbol text color

    //up and down
    "mainSeriesProperties.candleStyle.upColor": getTVColor("up"),
    "mainSeriesProperties.candleStyle.downColor": getTVColor("down"),
    "mainSeriesProperties.candleStyle.drawBorder": true,
    "mainSeriesProperties.candleStyle.borderUpColor": getTVColor("up"),
    "mainSeriesProperties.candleStyle.borderDownColor": getTVColor("down"),
    "mainSeriesProperties.candleStyle.wickUpColor": getTVColor("up"),
    "mainSeriesProperties.candleStyle.wickDownColor": getTVColor("down"),
    "mainSeriesProperties.candleStyle.barColorsOnPrevClose": false,
    "mainSeriesProperties.hollowCandleStyle.upColor": getTVColor("up"),
    "mainSeriesProperties.hollowCandleStyle.downColor": getTVColor("down"),
    "mainSeriesProperties.hollowCandleStyle.drawWick": true,
    "mainSeriesProperties.hollowCandleStyle.drawBorder": true,
    "mainSeriesProperties.hollowCandleStyle.borderUpColor": getTVColor("up"),
    "mainSeriesProperties.hollowCandleStyle.borderDownColor":
      getTVColor("down"),
    "mainSeriesProperties.hollowCandleStyle.wickUpColor": getTVColor("up"),
    "mainSeriesProperties.hollowCandleStyle.wickDownColor": getTVColor("down"),
    "mainSeriesProperties.haStyle.upColor": getTVColor("up"),
    "mainSeriesProperties.haStyle.downColor": getTVColor("down"),
    "mainSeriesProperties.haStyle.drawWick": true,
    "mainSeriesProperties.haStyle.drawBorder": true,
    "mainSeriesProperties.haStyle.borderUpColor": getTVColor("up"),
    "mainSeriesProperties.haStyle.borderDownColor": getTVColor("down"),
    "mainSeriesProperties.haStyle.wickUpColor": getTVColor("up"),
    "mainSeriesProperties.haStyle.wickDownColor": getTVColor("down"),
    "mainSeriesProperties.barStyle.upColor": getTVColor("up"),
    "mainSeriesProperties.barStyle.downColor": getTVColor("down"),
    "mainSeriesProperties.barStyle.barColorsOnPrevClose": false,
    "mainSeriesProperties.barStyle.dontDrawOpen": false,
    "mainSeriesProperties.lineStyle.color": getTVColor("down"),
  };

  const studyOverrides = {
    "volume.volume.color.0": getTVColor("up"),
    "volume.volume.color.1": getTVColor("down"),
    // "volume.volume.transparency": 0,
    // "volume.volume ma.color": "blue",
    // "volume.volume ma.transparency": 0,
    // "volume.options.showStudyArguments": false,
    // "volume.options.showStudyTitles": false,
    // "volume.options.showStudyValues": false,
    // "volume.options.showLegend": false,
    // "volume.options.showStudyOutput": false,
    // "volume.options.showStudyOverlay": false,
    // "volume.options.showSeriesTitle": false,
    // "volume.options.showSeriesOHLC": false,
    // "volume.options.showBarChange": false,
    // "volume.options.showCountdown": false,
  };

  const timeFrames = [
    { text: "15m", resolution: "15" as ResolutionString },
    { text: "30m", resolution: "30" as ResolutionString },
    { text: "1h", resolution: "60" as ResolutionString },
    { text: "3h", resolution: "120" as ResolutionString },
    {
      text: "1d",
      resolution: "D" as ResolutionString,
      description: "1 day",
    },
    {
      text: "3d",
      resolution: "D" as ResolutionString,
      description: "3 days",
    },
    {
      text: "1w",
      resolution: "W" as ResolutionString,
      description: "1 week",
    },
    {
      text: "1M",
      resolution: "M" as ResolutionString,
      description: "1 month",
    },
  ];

  const widgetOptions: ChartingLibraryWidgetOptions = {
    symbol: `Bitfinex:${baseCoin}/${tradeCoin}`,
    datafeed: datafeed_dummy,
    fullscreen: false,
    autosize: true,
    width: 1000,
    height: 500,
    container: containerRef.current ? containerRef.current : "",
    container_id: container_id,

    // from defaults
    ...widgetOptionsDefault,

    custom_font_family: "serif",

    // features
    enabled_features: ENABLED_FEATURES,
    disabled_features: DISABLED_FEATURES,

    // dependent
    theme: darkModeStatus ? "Dark" : "Light",
    locale: (trading_view_languages.includes(router.locale as LanguageCode)
      ? router.locale
      : "en") as LanguageCode,
    preset: isTablet ? "mobile" : undefined,

    // overrides
    studies_overrides: studyOverrides,
    overrides: {},
    time_frames: timeFrames,
  };

  const depsArr = [darkModeStatus, router.locale, isTablet, s, p, coinPair];

  const { depsArr: d } = useTradingView({
    widgetOptions: widgetOptions,
    depsArr: depsArr,
    applyOverrides: applyOverrides,
  });

  return {
    container_id,
    containerRef,
  };
};
