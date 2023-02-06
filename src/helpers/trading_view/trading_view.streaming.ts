import {
  LibrarySymbolInfo,
  ResolutionString,
  SubscribeBarsCallback,
} from "public/lib/trading_view/charting_library/charting_library";
import io from "socket.io-client";
import { getNextDailyBarTime, parseFullSymbol } from "./trading_view.helpers";

const socket = io("wss://streamer.cryptocompare.com");
const channelToSubscription: any = new Map();

socket.on("connect", () => {
  // console.log("tv: [socket] Connected");
});

socket.on("disconnect", (reason) => {
  // console.log("tv: [socket] Disconnected:", reason);
});

socket.on("error", (error) => {
  // console.log("tv: [socket] Error:", error);
});

socket.on("m", (data) => {
  // console.log("tv: [socket] Message:", data);
  const [
    eventTypeStr,
    exchange,
    fromSymbol,
    toSymbol,
    ,
    ,
    tradeTimeStr,
    ,
    tradePriceStr,
  ] = data.split("~");

  if (parseInt(eventTypeStr) !== 0) {
    // skip all non-TRADE events
    return;
  }
  const tradePrice = parseFloat(tradePriceStr);
  const tradeTime = parseInt(tradeTimeStr);
  const channelString = `0~${exchange}~${fromSymbol}~${toSymbol}`;
  const subscriptionItem = channelToSubscription.get(channelString);
  if (subscriptionItem === undefined) {
    return;
  }
  const lastDailyBar = subscriptionItem.lastDailyBar;
  const nextDailyBarTime = getNextDailyBarTime(lastDailyBar.time);

  let bar: any;

  if (tradeTime >= nextDailyBarTime) {
    bar = {
      time: nextDailyBarTime,
      open: tradePrice,
      high: tradePrice,
      low: tradePrice,
      close: tradePrice,
    };
    //console.log("tv: [socket] Generate new bar", bar);
  } else {
    bar = {
      ...lastDailyBar,
      high: Math.max(lastDailyBar.high, tradePrice),
      low: Math.min(lastDailyBar.low, tradePrice),
      close: tradePrice,
    };
    //console.log("tv: [socket] Update the latest bar by price", tradePrice);
  }
  subscriptionItem.lastDailyBar = bar;

  // send data to every subscriber of that symbol
  subscriptionItem.handlers.forEach((handler: any) => handler.callback(bar));
});

export function subscribeOnStream(
  symbolInfo: LibrarySymbolInfo,
  resolution: ResolutionString,
  onRealtimeCallback: SubscribeBarsCallback,
  subscriberUID: string,
  onResetCacheNeededCallback: () => void,
  lastDailyBar: any
) {
  const parsedSymbol = parseFullSymbol(symbolInfo.full_name);
  const channelString = `0~${parsedSymbol?.exchange}~${parsedSymbol?.fromSymbol}~${parsedSymbol?.toSymbol}`;
  const handler = {
    id: subscriberUID,
    callback: onRealtimeCallback,
  };
  let subscriptionItem = channelToSubscription.get(channelString);
  if (subscriptionItem) {
    // already subscribed to the channel, use the existing subscription
    subscriptionItem.handlers.push(handler);
    return;
  }
  subscriptionItem = {
    subscriberUID,
    resolution,
    lastDailyBar,
    handlers: [handler],
  };
  channelToSubscription.set(channelString, subscriptionItem);
  // console.log("[subscribeBars]: Subscribe to streaming. Channel:", channelString);
  socket.emit("SubAdd", { subs: [channelString] });
}

export function unsubscribeFromStream(subscriberUID: string) {
  // find a subscription with id === subscriberUID
  for (const channelString of channelToSubscription.keys()) {
    const subscriptionItem = channelToSubscription.get(channelString);
    const handlerIndex = subscriptionItem.handlers.findIndex(
      (handler: any) => handler.id === subscriberUID
    );

    if (handlerIndex !== -1) {
      // remove from handlers
      subscriptionItem.handlers.splice(handlerIndex, 1);

      if (subscriptionItem.handlers.length === 0) {
        // unsubscribe from the channel, if it was the last handler
        // console.log("[unsubscribeBars]: Unsubscribe from streaming. Channel:",channelString);
        socket.emit("SubRemove", { subs: [channelString] });
        channelToSubscription.delete(channelString);
        break;
      }
    }
  }
}
