import cn from "classnames";
import styles from "./Nav.component.module.sass";
import { Settings } from "components/settings/Settings.component";

export const Nav = () => {
  return (
    <nav className={cn(styles.nav, "container")}>
      <h2>TV Chart</h2>

      <Settings />
    </nav>
  );
};
