import React from "react";
import styles from "../../Styles/Settings.module.css";
import { Slider } from "@mui/material";
export default function Slid({
  value,
  setValue,
  title,
  description,
  min,
  max,
  step,
  model,
}) {
  return (
    <div className={styles.settingContainer}>
      <div className={styles.settingTitle}>{title}</div>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          let newValue = +e.target.value;
          if (newValue < min) newValue = min;
          if (newValue > max) newValue = max;
          setValue(newValue);
        }}
        min={min}
        max={max}
        step={step}
        className={styles.numberInput}
      />
      <Slider
        value={value}
        onChange={(e, v) => setValue(v)}
        min={min}
        max={max}
        step={step}
        valueLabelDisplay="auto"
        color={model === "euterpe-v2" ? "warning" : "info"}
      />
      <div className={styles.settingDescription}>{description}</div>
    </div>
  );
}
