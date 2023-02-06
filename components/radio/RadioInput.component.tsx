import React from "react";
import cn from "classnames";
import styles from "./Radio.module.sass";

interface RadioProps {
  className?: string;
  content: string | React.ReactElement;
  name: string;
  id: string;
  register: object;
  err?: any;
  defaultChecked?: boolean;
  disabled?: boolean;
  value: string | number;
  label?: string;
}

export const RadioInput: React.FC<RadioProps> = ({
  className,
  content,
  name,
  id,
  defaultChecked,
  register,
  err,
  disabled,
  value,
  label,
  ...props
}) => {
  return (
    <div className={cn("mb-3", className)}>
      {label && <div className={cn(styles.label)}>{label}</div>}

      <label
        htmlFor={id}
        className={cn(styles.radio, disabled && styles.radioDisabled)}
      >
        <input
          className={styles.input}
          type="radio"
          name={name}
          id={id}
          defaultChecked={defaultChecked}
          value={value}
          {...register}
          {...props}
          disabled={disabled}
        />
        <span className={styles.inner}>
          <span className={styles.tick}></span>
          <span className={styles.text}>{content}</span>
        </span>
      </label>

      {err && <div className={styles.error}>{err}</div>}
    </div>
  );
};
