import React from "react";
import { Switch } from "@mui/material";
import styles from "../../Styles/Settings.module.css";
export default function Knob({ value, setValue, title, description }) {
  return (
    <div className={styles.settingContainer}>
      <div className={styles.settingTitle}> </div>
      {title}
      <Switch
        checked={value}
        onChange={() => setValue(!value)}
        color="info"
        inputProps={{ "aria-label": "controlled" }}
        className={styles.switch}
      />
      <div className={styles.settingDescription}>{description}</div>
    </div>
  );
}
