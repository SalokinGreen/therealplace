import React, { useState } from "react";
import styles from "../../Styles/Settings.module.css";
import { Slider, Button } from "@mui/material";
import { ImPlus, ImMinus } from "react-icons/im";
export default function Groupe({
  groupe,
  setGroupe,
  title,
  description,
  model,
  bias,
}) {
  const [input, setInput] = useState("");
  const [currentGroupe, setCurrentGroupe] = useState(0);
  const handleAdd = () => {
    const newGroupe = [...groupe];
    newGroupe.push({ words: [], value: 0 });
    setGroupe(newGroupe);
    setCurrentGroupe(newGroupe.length - 1);
  };
  const handleSubmit = () => {
    //Add words to the current object
    const newGroupe = [...groupe];
    newGroupe[currentGroupe].words.push(input);
    setGroupe(newGroupe);
    setInput("");
  };
  const onChange = (e) => {
    setInput(e.target.value);
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };
  const handleRemove = (index) => {
    const newGroupe = [...groupe];
    newGroupe[currentGroupe].words.splice(index, 1);
    setGroupe(newGroupe);
  };
  const handleDelete = () => {
    const newGroupe = [...groupe];
    newGroupe.splice(currentGroupe, 1);
    setGroupe(newGroupe);
    setCurrentGroupe(0);
  };
  return (
    <div className={styles.settingsContainer}>
      <div className={styles.settingTitle}>{title}</div>
      <div className={styles.settingDescription}>{description}</div>
      <div className={styles.groupeContainer}>
        <div className={styles.groupeAddContainer}>
          <div className={styles.groupeDropdown}>
            <select
              className={styles.groupeSelect}
              value={currentGroupe}
              onChange={(e) => setCurrentGroupe(e.target.value)}
              color={model === "euterpe-v2" ? "warning" : "info"}
            >
              {groupe.map((item, index) => {
                return (
                  <option
                    value={index}
                    className={styles.groupeOption}
                    selected={index === currentGroupe}
                    onClick={() => setCurrentGroupe(index)}
                  >
                    {bias ? `Bias: ${item.value}` : `Set ${index + 1}`}
                  </option>
                );
              })}
            </select>
          </div>
          <div className={styles.groupeButtons}>
            <Button
              className={styles.groupeButton}
              onClick={handleAdd}
              variant="contained"
              color={model === "euterpe-v2" ? "warning" : "info"}
            >
              <ImPlus />
            </Button>
            <Button
              className={styles.groupeButton}
              onClick={handleDelete}
              variant="contained"
              color={model === "euterpe-v2" ? "warning" : "info"}
            >
              <ImMinus />
            </Button>
          </div>
        </div>
        <div className={styles.groupeList}>
          {groupe[currentGroupe] &&
            groupe[currentGroupe].words.map((item, index) => {
              return (
                <div className={styles.groupeItem}>
                  <div
                    className={styles.groupeItemText}
                    onClick={() => handleRemove(index)}
                  >
                    "{item}"
                  </div>
                </div>
              );
            })}
        </div>

        <div className={styles.groupeInputGroupe}>
          <input
            className={styles.groupeInput}
            onChange={onChange}
            onKeyDown={handleKeyPress}
            value={input}
            disabled={groupe.length === 0}
          ></input>
          <Button
            className={styles.groupeButtonAdd}
            onClick={handleSubmit}
            variant="contained"
            color={model === "euterpe-v2" ? "warning" : "info"}
            disabled={groupe.length === 0}
          >
            <ImPlus />
          </Button>
        </div>
        {bias && (
          <div className={styles.groupeSliderContainer}>
            <input
              className={styles.groupeInput}
              value={groupe.length > 0 ? groupe[currentGroupe].value : null}
              onChange={(e) => {
                const newGroupe = [...groupe];
                newGroupe[currentGroupe].value = e.target.value;
                setGroupe(newGroupe);
              }}
              disabled={groupe.length === 0}
            ></input>
            <Slider
              className={styles.groupeSlider}
              value={groupe.length > 0 ? groupe[currentGroupe].value : null}
              onChange={(e) => {
                const newGroupe = [...groupe];
                newGroupe[currentGroupe].value = e.target.value;
                setGroupe(newGroupe);
              }}
              valueLabelDisplay="auto"
              step={1}
              min={-100}
              max={100}
              color={model === "euterpe-v2" ? "warning" : "info"}
              disabled={groupe.length === 0}
            />
          </div>
        )}
      </div>
    </div>
  );
}
