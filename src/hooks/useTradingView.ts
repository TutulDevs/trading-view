import { ChartingLibraryWidgetOptions } from "public/lib/trading_view/charting_library/charting_library";
import { useEffect } from "react";
import { useTradingViewType } from "src/globalTypes";
// import { widget } from "../../public/trading_view/charting_library/charting_library.esm";
import { widget } from "../../public/lib/trading_view/charting_library";

export const useTradingView = ({
  widgetOptions,
  depsArr,
  applyOverrides,
}: useTradingViewType) => {
  const chartInit = (config: ChartingLibraryWidgetOptions) => {
    const tvWidget = new widget(config);

    // console.log("tv: chartInit ", tvWidget);
    window.tvWidget = tvWidget;

    window.tvWidget.onChartReady(() => {
      // console.log("tv: onChartReady ");
      window.tvWidget?.applyOverrides(applyOverrides || {});
    });
  };

  // on mount
  useEffect(() => {
    window.tvWidget = null;

    chartInit(widgetOptions);

    // componentWillUnmount
    return () => {
      if (window.tvWidget !== null) {
        window.tvWidget?.remove();
        window.tvWidget = null;
      }
    };
  }, depsArr);

  return { depsArr };
};
