import cn from "classnames";
import styles from "./Settings.component.module.sass";
import { useTradeColors } from "src/hooks/useTradeColors";
import { useSettings } from "./useSettings.component";
import OutsideClickHandler from "react-outside-click-handler";
import { BsArrowDown, BsArrowUp } from "react-icons/bs";
import { Radio } from "components/radio/Radio.component";
import { BiCog } from "react-icons/bi";
import useDarkMode from "use-dark-mode";

export const Settings: React.FC<{ className?: string }> = ({ className }) => {
  const {
    visible,
    setVisible,
    styleSettings,
    onStyleSettingsChange,
    styleSettingsOptions,
    colorPreferenceOptions,
    colorPreference,
    handleColorPrefChange,
  } = useSettings();

  const darkMode = useDarkMode(false);

  const { handleTradeColors } = useTradeColors();

  return (
    <>
      <OutsideClickHandler onOutsideClick={() => setVisible(false)}>
        <div
          className={cn(className, styles.settings, {
            [styles.active]: visible,
          })}
        >
          <button
            className={cn(styles.head, styles.active)}
            onClick={() => setVisible(!visible)}
          >
            <BiCog />
          </button>

          <div className={styles.body}>
            {/* theme */}
            <div className={cn(styles.theme, styles.borderBottom)}>
              <p>{"Theme"} (toggle) </p>

              <input
                type="checkbox"
                name="theme"
                id="theme"
                checked={darkMode.value}
                onChange={darkMode.toggle}
              />
            </div>

            {/* style/ color settings */}
            <div className={cn(styles.borderBottom)}>
              <p className={styles.title}>{"Style Settings"}</p>

              {styleSettingsOptions.map((item, index) => (
                <Radio
                  key={index}
                  full
                  name={"styleSettings"}
                  className={cn("mt-2")}
                  value={item.value}
                  checked={styleSettings === item.value}
                  onChange={(e) => onStyleSettingsChange(e.target.value)}
                  content={
                    <>
                      <span className={styles.radioContent}>
                        <span>{item.title}</span>

                        {item.colors.map((col, idx) => (
                          <span
                            key={idx}
                            className={cn(styles.box)}
                            style={{
                              backgroundColor: `var(--${col})`,
                            }}
                          />
                        ))}
                      </span>
                    </>
                  }
                />
              ))}
            </div>

            {/* color preference */}
            <div className={cn(styles.borderBottom)}>
              <p className={styles.title}>{"Color Preference"}</p>

              {colorPreferenceOptions.map((item, idx) => (
                <Radio
                  key={idx}
                  full
                  name={"colorPreference"}
                  className={cn("mt-2")}
                  value={String(item.value)}
                  checked={colorPreference === item.value}
                  onChange={() => handleColorPrefChange(item.value)}
                  content={
                    <>
                      <span className={styles.radioContent}>
                        <span>{item.title}</span>

                        <span className={cn(styles.arrows)}>
                          <BsArrowUp
                            className={cn(handleTradeColors(item.colors[0]))}
                          />
                          <BsArrowDown
                            className={cn(handleTradeColors(item.colors[1]))}
                          />
                        </span>
                      </span>
                    </>
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </OutsideClickHandler>
    </>
  );
};
