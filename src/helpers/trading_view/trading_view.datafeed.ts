import {
  Bar,
  HistoryCallback,
  IBasicDataFeed,
  LibrarySymbolInfo,
  OnReadyCallback,
  PeriodParams,
  ResolutionString,
  ResolveCallback,
  SearchSymbolResultItem,
  SearchSymbolsCallback,
  SubscribeBarsCallback,
  SymbolResolveExtension,
} from "public/lib/trading_view/charting_library/charting_library";
import { CC_Bar_type } from "src/globalTypes";
import {
  makeApiRequest,
  parseFullSymbol,
  getAllSymbols,
  configurationData,
  lastBarsCache,
} from "./trading_view.helpers";
import {
  subscribeOnStream,
  unsubscribeFromStream,
} from "./trading_view.streaming";

export const datafeed_dummy: IBasicDataFeed = {
  onReady: (callback: OnReadyCallback) => {
    //console.log("tv: [onReady]: Method call");
    callback(configurationData);
  },

  searchSymbols: async (
    userInput: string,
    exchange: string,
    symbolType: string,
    onResult: SearchSymbolsCallback
  ) => {
    //console.log("tv: [searchSymbols]: Method call");
    const symbols = await getAllSymbols();

    const newSymbols: SearchSymbolResultItem[] = symbols.filter((symbol) => {
      const isExchangeValid = exchange === "" || symbol.exchange === exchange;
      const isFullSymbolContainsInput =
        symbol.full_name.toLowerCase().indexOf(userInput.toLowerCase()) !== -1;
      return isExchangeValid && isFullSymbolContainsInput;
    });

    onResult(newSymbols);
  },

  // @ts-ignore
  resolveSymbol: async (
    symbolName: string,
    onResolve: ResolveCallback,
    onError: ErrorCallback,
    extension?: SymbolResolveExtension | undefined
  ) => {
    //console.log("tv: [resolveSymbol]: Method call", { symbolName });
    const symbols = await getAllSymbols();
    const symbolItem = symbols.find(
      ({ full_name }) => full_name === symbolName
    );
    if (!symbolItem) {
      //console.log("tv: [resolveSymbol]: Cannot resolve symbol", { symbolName });
      onError(
        new DOMException("tv: [resolveSymbol]: err Cannot resolve symbol")
      );
      return;
    }

    //console.log("tv: symbolItem ", symbolItem);

    const symbolInfo: LibrarySymbolInfo = {
      name: symbolItem.symbol,
      full_name: symbolItem.full_name,
      ticker: symbolItem.ticker,
      description: symbolItem.description,
      type: symbolItem.type,
      session: "24x7",
      exchange: symbolItem.exchange,
      listed_exchange: "",
      timezone: "Etc/UTC",
      format: "price",
      pricescale: 100,
      minmov: 1,
      has_intraday: false,
      has_no_volume: false, // whether to show volume bars or not
      has_weekly_and_monthly: false,
      supported_resolutions:
        configurationData.supported_resolutions as ResolutionString[],
      volume_precision: 2,
      data_status: "streaming",
    };

    //console.log("tv: [resolveSymbol]: Symbol resolved", { symbolName });
    onResolve(symbolInfo);
  },

  // @ts-ignore
  getBars: async (
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    periodParams: PeriodParams,
    onResult: HistoryCallback,
    onError: ErrorCallback
  ) => {
    const { from, to, firstDataRequest } = periodParams;

    //console.log("tv: [getBars]: Method call", symbolInfo, resolution, from, to);

    const parsedSymbol = parseFullSymbol(symbolInfo.full_name);
    const urlParameters = {
      e: parsedSymbol?.exchange,
      fsym: parsedSymbol?.fromSymbol,
      tsym: parsedSymbol?.toSymbol,
      toTs: to,
      limit: 100,
    };
    const query = Object.keys(urlParameters)
      // @ts-ignore
      .map((name) => `${name}=${encodeURIComponent(urlParameters[name])}`)
      .join("&");

    try {
      const data = await makeApiRequest(`data/histoday?${query}`);
      if (
        (data.Response && data.Response === "Error") ||
        data.Data.length === 0
      ) {
        // "noData" should be set if there is no data in the requested period.
        onResult([], {
          noData: true,
        });
        return;
      }

      let bars: Bar[] = [];

      data.Data.forEach((bar: CC_Bar_type) => {
        if (bar.time >= from && bar.time < to) {
          bars = [
            ...bars,
            {
              time: bar.time * 1000,
              low: bar.low,
              high: bar.high,
              open: bar.open,
              close: bar.close,
              volume: bar.volumefrom, // pass to show volume bars
            },
          ];
        }
      });

      if (firstDataRequest) {
        lastBarsCache.set(symbolInfo.full_name, {
          ...bars[bars.length - 1],
        });
      }
      //console.log(`tv: [getBars]: returned ${bars.length} bar(s)`);

      onResult(bars, {
        noData: false,
      });
    } catch (error: any) {
      //console.log("tv: [getBars]: Get error", error);
      onError(new DOMException("tv: [getBars]: Get error", error));
    }
  },

  subscribeBars: (
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    onTick: SubscribeBarsCallback,
    listenerGuid: string,
    onResetCacheNeededCallback: () => void
  ) => {
    // console.log("tv: [subscribeBars]: Method call with listenerGuid:",listenerGuid);

    subscribeOnStream(
      symbolInfo,
      resolution,
      onTick,
      listenerGuid,
      onResetCacheNeededCallback,
      lastBarsCache.get(symbolInfo.full_name)
    );
  },

  unsubscribeBars: (subscriberUID: string) => {
    // console.log("tv: [unsubscribeBars]: Method call with subscriberUID:",subscriberUID);
    unsubscribeFromStream(subscriberUID);
  },
};
