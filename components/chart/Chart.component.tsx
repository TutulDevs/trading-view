import cn from "classnames";
import styles from './Chart.component.module.sass'
import { useChart } from "./useChart.component";


const Chart: React.FC<{ className?: string }> = ({ className }) => {
  const { container_id, containerRef } = useChart();

  return (
    <>
      <div
        ref={containerRef as React.RefObject<HTMLDivElement>}
        id={container_id}
        className={cn(className, styles.chart)}
      />
    </>
  );
};

export default Chart;
