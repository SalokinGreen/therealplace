// SubBox.js
import React, { useState, useEffect, useRef } from "react";
import styles from "./SubBox.module.css"; // Make sure to create this CSS module

const SubBox = ({ subsObj, sub, setSub }) => {
  // Make an array out of the subs object
  const subs = Object.keys(subsObj);
  const subBoxRef = useRef(null);

  // State to track the active sub and the open/closed state of the box

  const [isOpen, setIsOpen] = useState(false);

  // Function to handle changing the active sub
  const handleSubChange = (element) => {
    setSub(element);
    setIsOpen(false); // Close the box when a sub is selected
  };
  const handleClickOutside = (event) => {
    if (subBoxRef.current && !subBoxRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className={styles.subBox} ref={subBoxRef}>
      <div className={styles.activeSub} onClick={() => setIsOpen(!isOpen)}>
        {subsObj[sub].name}
      </div>

      {isOpen && (
        <div className={styles.subList}>
          {subs.map((element) => (
            <div
              key={element}
              className={`${styles.subItem} ${
                element === sub ? styles.active : ""
              }`}
              onClick={() => handleSubChange(element)}
            >
              {subsObj[element].name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubBox;
