import cn from "classnames";
import Link from "next/link";
import styles from "./Suggestions.component.module.sass";

export const Suggestions = () => {
  return (
    <div className={cn(styles.suggestions, "container")}>
      <p>Suggestions:</p>

      <div>
        <Link href={`?pair=BTC_USD`}>BTC/USD</Link>
        <Link href={`?pair=BTC_USDT`}>BTC/USDT</Link>
        <Link href={`?pair=NEO_BTC`}>NEO/BTC</Link>
      </div>
    </div>
  );
};
