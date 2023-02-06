# Trading View Chart in NextJS

Let's implement TradingView's [Advanced Real-Time Chart Widget](https://www.tradingview.com/chart) in NextJS.

## Required Files:

- Charting Library files from [this site](https://www.tradingview.com/HTML5-stock-forex-bitcoin-charting-library/?feature=technical-analysis-charts) under **Technical Analysis Charts** section.

## Folder Structure

- `components` for reusable components

- `pages` NextJS pages

- `public` public assets. We put the _Charting Library_ files in this folder.

- `src` for helper functions, core constants, global custom hooks, `redux-toolkit` folder and a file for global types.

- `styles` for `.sass` files.

## Lets Start Chartin' 🚀

We start our charting functions from `/src/hooks/useTradingView.ts` file. Let's open the file and read through.

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

In the `/components/chart/Chart.component.tsx` file, we only have a `div` that has a `ref`, `id` and some styling. We get the `id` and `ref` from the `/components/chart/useChart.component.ts` file. The `useChart` hook is the place where we customize the chart.

### `useChart`

From the line 25-40, we mainly have some variables and helper functions. Then we see some objects.

- `applyOverrides` see [applyOverrides](/README.md/#applyoverrides)
- `studyOverrides` see [studyOverrides](/README.md/#studyOverrides)
- `timeFrames` see [timeFrames](/README.md/#timeFrames)
- `widgetOptions` see [widgetOptions](/README.md/#widgetOptions)
- `depsArr` the dependency array on which the the char re-initiates.

### applyOverrides

Apply overrides to the colors of the main chart background and bars. This doesn't override the colors of the top, bottom or side toolbars.

### studyOverrides

This override object is to set in `widgetOptions` object for the key `studies_overrides`. It overrides the colors of the `volume` indicator.

### widgetOptions

### timeFrames
