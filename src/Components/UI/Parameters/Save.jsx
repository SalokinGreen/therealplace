import React, { useState, useRef } from "react";
import { Button } from "@mui/material";
import styles from "../../Styles/Saves.module.css";
import db from "@/util/db";

export default function Save({ save, loadSave, setSaves }) {
  const { date } = save;
  const [name, setName] = useState(save.name);
  const nameRef = useRef(null);

  const handleDelete = async () => {
    let saves = await db.getItem("saves");
    const index = saves.findIndex(
      (s) => s.date === save.date && s.name === save.name
    );
    if (index !== -1) {
      saves.splice(index, 1);
      await db.setItem("saves", saves);
      setSaves(saves);
    }
  };

  const handleExport = () => {
    const file = new Blob([JSON.stringify(save)], { type: "application/json" });
    const fileURL = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = fileURL;
    link.download = `${name}.save`;
    link.click();
  };

  const handleNameChange = async () => {
    const newName = nameRef.current.innerText;
    setName(newName);

    let saves = await db.getItem("saves");
    const index = saves.findIndex(
      (s) => s.date === save.date && s.name === save.name
    ); // find the index of the save
    if (index !== -1) {
      saves[index].name = newName; // update the save name
      await db.setItem("saves", saves);
      setSaves(saves);
    }
  };

  return (
    <div className={styles.saveContainer}>
      <div className={styles.saveInfo}>
        <h3
          className={styles.saveName}
          ref={nameRef}
          onBlur={handleNameChange}
          contentEditable
        >
          {name}
        </h3>
        <p className={styles.saveDate}>{new Date(date).toLocaleString()}</p>
      </div>
      <div className={styles.saveButtons}>
        <Button
          variant="contained"
          color="success"
          className={styles.loadButton}
          onClick={() => loadSave(save)}
        >
          Load
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={styles.exportButton}
          onClick={handleExport}
        >
          Export
        </Button>
        <Button
          variant="contained"
          color="error"
          className={styles.deleteButton}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
