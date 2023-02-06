import {
  AvailableSaveloadVersions,
  DatafeedConfiguration,
  Exchange,
  LanguageCode,
  ResolutionString,
} from "public/lib/trading_view/charting_library/charting_library";
import { allSymbolType, TRADING_VIEW_DEFAULTS } from "src/globalTypes";

export const lastBarsCache = new Map();

export const configurationData: DatafeedConfiguration = {
  supported_resolutions: [
    "15",
    "30",
    "60",
    "120",
    "240",
    "360",
    "D",
    "W",
    "M",
  ] as ResolutionString[],
  exchanges: [
    {
      value: "Bitfinex",
      name: "Bitfinex",
      desc: "Bitfinex",
    },
    {
      value: "Kraken",
      name: "Kraken",
      desc: "Kraken bitcoin exchange",
    },
  ],
  symbols_types: [
    {
      name: "crypto",
      value: "crypto",
    },
  ],
};

export const trading_view_languages: LanguageCode[] = [
  "ar",
  "zh",
  "cs",
  "da_DK",
  "nl_NL",
  "en",
  "et_EE",
  "fr",
  "de",
  "el",
  "he_IL",
  "hu_HU",
  "id_ID",
  "it",
  "ja",
  "ko",
  "fa",
  "pl",
  "pt",
  "ro",
  "ru",
  "sk_SK",
  "es",
  "sv",
  "th",
  "tr",
  "vi",
  "no",
  "ms_MY",
  "zh_TW",
];

export const trading_view_intervals = {
  MINUTES_5: "5",
  MINUTES_15: "15",
  MINUTES_30: "30",
  HOUR: "60",
  HOURS_3: "180",
  HOURS_6: "360",
  HOURS_12: "720",
  DAY: "D",
  WEEK: "W",
};

export const ENABLED_FEATURES = [
  "save_chart_properties_to_local_storage",
  "use_localstorage_for_settings",
  // "hide_last_na_study_output",
  // "dont_show_boolean_study_arguments",
];

export const DISABLED_FEATURES = [
  // "header_widget",
  // "header_symbol_search",
  // "header_saveload",
  // "header_symbol_search_hot_key",
  // "header_interval_dropdown",
  // "header_undo_redo",
  // "header_screenshot",
  // "header_settings",
  // "header_fullscreen_button",
  // "header_indicators",
  // "header_interval_dialog_button",
  // "header_compare",
  // "header_chart_type",
  // "header_interval_dialog_button",
  // "symbol_search_hot_key",
  "symbol_info",
  // "display_market_status",
  "volume_force_overlay",
  // "compare_symbol",
  // "border_around_the_chart",
  // "remove_library_container_border",
  "show_interval_dialog_on_key_press",
];

export const widgetOptionsDefault = {
  interval: TRADING_VIEW_DEFAULTS.INTERVAL as ResolutionString,
  library_path: TRADING_VIEW_DEFAULTS.LIBRARY_PATH as string,
  charts_storage_url: TRADING_VIEW_DEFAULTS.CHARTS_STORAGE_URL as string,
  charts_storage_api_version:
    TRADING_VIEW_DEFAULTS.CHARTS_STORAGE_API_VERSION as AvailableSaveloadVersions,
  client_id: TRADING_VIEW_DEFAULTS.CLIENT_ID as string,
  user_id: TRADING_VIEW_DEFAULTS.USER_ID as string,
  custom_css_url: TRADING_VIEW_DEFAULTS.CUSTOM_CSS as string,
};

// Make requests to CryptoCompare API
export async function makeApiRequest(path: string) {
  try {
    const response = await fetch(`https://min-api.cryptocompare.com/${path}`);
    return response.json();
  } catch (error: any) {
    throw new Error(`CryptoCompare request error: ${error.status}`);
  }
}

// Generate a symbol ID from a pair of the coins
export function generateSymbol(
  exchange: string,
  fromSymbol: string,
  toSymbol: string
) {
  const short = `${fromSymbol}/${toSymbol}`;
  return {
    short,
    full: `${exchange}:${short}`,
  };
}

export function parseFullSymbol(fullSymbol: string) {
  const match = fullSymbol.match(/^(\w+):(\w+)\/(\w+)$/);
  if (!match) {
    return null;
  }

  return {
    exchange: match[1],
    fromSymbol: match[2],
    toSymbol: match[3],
  };
}

export async function getAllSymbols() {
  const data = await makeApiRequest("data/v3/all/exchanges");
  let allSymbols: allSymbolType[] = [];

  for (const exchange of configurationData.exchanges as Exchange[]) {
    const pairs = data.Data[exchange.value].pairs;

    for (const leftPairPart of Object.keys(pairs)) {
      const symbols = pairs[leftPairPart].map((rightPairPart: string) => {
        const symbol = generateSymbol(
          exchange.value,
          leftPairPart,
          rightPairPart
        );

        return {
          symbol: symbol.short,
          full_name: symbol.full,
          description: symbol.short,
          exchange: exchange.value,
          type: "crypto",
          ticker: "",
        };
      });

      allSymbols = [...allSymbols, ...symbols];
    }
  }

  return allSymbols;
}

export function getNextDailyBarTime(barTime: number) {
  const date = new Date(barTime * 1000);
  date.setDate(date.getDate() + 1);
  return date.getTime() / 1000;
}
