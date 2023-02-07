# Trading View Chart in NextJS

Let's implement TradingView's [Advanced Real-Time Chart Widget](https://www.tradingview.com/chart) in NextJS.

## Required Files:

- Charting Library files from [this site](https://www.tradingview.com/HTML5-stock-forex-bitcoin-charting-library/?feature=technical-analysis-charts) under **Technical Analysis Charts** section.

## Folder Structure

- `components` for reusable components

- `pages` NextJS pages

- `public` public assets. We put the _Charting Library_ files in `/public/lib/trading_view` in this folder. The lib folder may be `gitignored`. Please check and and ask for the access.

- `src` for helper functions, core constants, global custom hooks, `redux-toolkit` folder and a file for global types.

- `styles` for `.sass` files.

## Lets Start Chartin' 🚀

We start our charting functions from `/src/hooks/useTradingView.ts` file. Let's open [the file](/src/hooks/useTradingView.ts) and read through.

**The Arguments**:

- `widgetOptions` is the setup object. Required.

- `depsArr` is the dependency array for the `useEffect`. It'll be an empty array if you don't want to re-initiate the chart on anything. Required.

- `applyOverrides` an optional object used for the styling of the main chart background and bars.

First we create a function named `chartinit`, which gets an argument which will be the `widgetOptions` we took as an argument for this custom hook. In the function we store the `widget` constructor in a variable and later we add the variable in the global `window` object as `tvWidget`. This new object has many methods attached to it. Here's the list of [the methods](/public/lib/trading_view/charting_library/charting_library.d.ts) in the interface `ChartingLibraryWidgetOptions`. We worked on the `onChartReady` and `applyOverrides` inside this.

Inside the `useEffect` we first made the `tvWidget` null so it doesn't keep anything from the past. Then we call out `chartInit` function. At last we write our cleaner function.

Finally we return the `depsArr` which we got from the argument. It's optional.

**Notes** 📝

- The arguments of the custom hooks are in an object.

- `window.tvWidget` is not giving ts error because in the `/src/globalTypes.ts` file we added `tvWidget` in the global namespace in `window` object.

## The Chart

In the [Chart Component](/components/chart/Chart.component.tsx) file, we only have a `div` that has a `ref`, `id` and some styling. We get the `id` and `ref` from the [useChart](/components/chart/useChart.component.ts) hook file. The `useChart` hook is the place where we customize the chart.

👉 Make sure the file is default exported. Named export will give build error.

### `useChart`

From the line 25-40, we mainly have some variables and helper functions. Then we see some objects.

- `applyOverrides` see [applyOverrides](/README.md/#applyoverrides)

- `studyOverrides` see [studyOverrides](/README.md/#studyOverrides)

- `timeFrames` see [timeFrames](/README.md/#timeFrames)

- `widgetOptions` see [widgetOptions](/README.md/#widgetOptions)

- `depsArr` the dependency array on which the the char re-initiates.

### applyOverrides

Apply overrides to the colors of the main chart background and bars. This doesn't override the colors of the top, bottom or side toolbars. See the `applyOverrides` object in [useChart](/components/chart/useChart.component.ts) hook which is commented there.

### studyOverrides

This override object is to set in `widgetOptions` object for the key `studies_overrides`. It overrides the colors of the newly created indicators. Example can be found in the `studyOverrides` object in [useChart](/components/chart/useChart.component.ts) hook which is commented there for the `volume` indicator. Others indicators are not properly tested yet.

### widgetOptions

It's the constructor of the `tvWidget` that is needed to inititate the chart. Let's talk about the `required` parameters.

**Symbol, interval**

Symbol is the symbol for the data fetching. Resolution or interval is a time period of one bar.

**Container**

The `container` can either be a reference to an attribute of a DOM element inside which the iframe with the chart will be placed or the `HTMLElement` itself. It can be `useRef` or `document.getElementById('id')` or just the id of the element as an reference.

**library_path**

The static path of the charting library. Provide the path to the folder, not any file.

**datafeed**

JS object that implements the [JS API](/public/lib/trading_view/charting_library_wiki/JS-Api.md). The required methods are:

- `onReady` This call is intended to provide the object filled with the configuration data. Charting Library assumes that you will call the callback function and pass your datafeed `configurationData` as an argument. Configuration data is an object.

- `searchSymbols` This call is intended to provide the list of symbols that match the user's search query.

- `resolveSymbol` Charting Library will call this function when it needs to get SymbolInfo by symbol name.

- `getBars` This function is called when the chart needs a history fragment defined by dates range.

- `subscribeBars` Charting Library calls this function when it wants to receive real-time updates for a symbol. The Library assumes that you will call `onRealtimeCallback` every time you want to update the most recent bar or to add a new one.

- `unsubscribeBars` Charting Library calls this function when it doesn't want to receive updates for this subscriber any more. `subscriberUID` will be the same object that Library passed to `subscribeBars` before.

To read more about `datafeed`, go to the [datafeed wiki](/public/lib/trading_view/charting_library_wiki/JS-Api.md) or the [datafeed file](/src/helpers/trading_view/trading_view.datafeed.ts).

### timeFrames

You can see the toolbar at the bottom of the chart. Each of those buttons on the left side switches the chart time frame. Switching time frame means:

- Switch the chart resolution
- Force the bars to scale horizontally in order to cover the entire requested date/time range.

You can customize default time frames using the `time_frames` argument of the widget constructor.
