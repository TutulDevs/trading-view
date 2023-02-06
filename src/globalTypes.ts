import {
  Bar,
  ChartingLibraryWidgetOptions,
  IChartingLibraryWidget,
  StudyOverrides,
} from "public/lib/trading_view/charting_library/charting_library";

// set tvWidget in the global window object
declare global {
  interface Window {
    tvWidget: IChartingLibraryWidget | null | undefined;
  }
}

export interface allSymbolType {
  symbol: string;
  full_name: string;
  description: string;
  exchange: string;
  type: string;
  ticker: string;
}

export interface CC_Bar_type extends Bar {
  volumefrom: number;
  volumeto: number;
  conversionType: string;
  conversionSymbol: string;
}

export enum TRADING_VIEW_DEFAULTS {
  LIBRARY_PATH = "/lib/trading_view/charting_library/",
  CHARTS_STORAGE_URL = "https://saveload.tradingview.com",
  CHARTS_STORAGE_API_VERSION = "1.1",
  CLIENT_ID = "tradingview.com",
  USER_ID = "public_user_id",
  CONTAINER_ID_SPOT = "tv_chart_container",
  INTERVAL = "1D",
  CUSTOM_CSS = "/lib/trading_view/trading_view.theme.css",
  TEST_SYMBOL = "Bitfinex:BTC/USD",
  PRESET_WIDTH = "1023",
}

export type useTradingViewType = {
  widgetOptions: ChartingLibraryWidgetOptions;
  depsArr: any[];
  applyOverrides?: StudyOverrides;
};
