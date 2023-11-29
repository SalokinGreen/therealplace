import React from "react";

// style
import styles from "./UI.module.css";
import Exit from "./Exit";

const Modal = ({ isOpen, onClose, children, size = "small" }) => {
  let modalSizeClass = "";
  if (size === "medium") {
    modalSizeClass = styles.modalMedium;
  } else if (size === "big") {
    modalSizeClass = styles.modalBig;
  }

  return (
    <div
      className={`${styles.modal} ${
        isOpen ? styles.open : ""
      } ${modalSizeClass}`}
    >
      <div className={styles.modalContent}>
        <Exit onClick={onClose}>X</Exit>
        {children}
      </div>
    </div>
  );
};

export default Modal;
