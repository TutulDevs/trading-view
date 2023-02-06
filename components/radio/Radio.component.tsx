import React from "react";
import cn from "classnames";
import styles from "./Radio.module.sass";

interface RadioProps {
  className?: string;
  content: string | React.ReactElement;
  name: string;
  value: string;
  checked?: boolean;
  onChange?: (value: boolean | any) => void;
  full?: boolean;
  disabled?: boolean;
}

export const Radio = ({
  className,
  content,
  name,
  checked,
  value,
  onChange,
  full = false,
  disabled,
}: RadioProps) => {
  return (
    <label
      className={cn(styles.radio, className, disabled && styles.radioDisabled)}
    >
      <input
        className={styles.input}
        type="radio"
        name={name}
        onChange={onChange}
        checked={checked}
        value={value}
        disabled={disabled}
      />
      <span className={cn(styles.inner, full && styles.innerFull)}>
        <span className={styles.tick}></span>
        <span className={cn(styles.text, full && styles.innerFull)}>
          {content}
        </span>
      </span>
    </label>
  );
};
