import React from "react";
import styles from "./UI.module.css";

const Exit = ({ onClick, children }) => {
  return (
    <button onClick={onClick} className={styles.exit}>
      {children}
    </button>
  );
};
export default Exit;
