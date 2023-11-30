import React, { useState, useEffect } from "react";

// style
import styles from "./Profile.module.css";

// components
import Button from "../UI/Button";
import Exit from "../UI/Exit";
import Modal from "../UI/Modal";
const Profile = ({
  setOpenProfile,
  username,
  setUsername,
  apiKey,
  setApiKey,
  setOpenThreads,
}) => {
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    localStorage.setItem("TRPusername", event.target.value);
  };

  const handleApiKeyChange = (event) => {
    setApiKey(event.target.value);
    localStorage.setItem("TRPapiKey", event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform any necessary actions with the username and API key
    console.log("Username:", username);
    console.log("API Key:", apiKey);
  };
  const handleThreads = (event) => {
    event.preventDefault();
    setOpenThreads(true);
    setOpenProfile(false);
  };

  return (
    <Modal isOpen={true} onClose={() => setOpenProfile(false)} size="small">
      <div className={styles.profileDetailsContainer}>
        <div className={styles.profileDetailContainer}>
          <p className={styles.profileLabel}>Username</p>
          <input
            className={styles.profileInput}
            type="text"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div className={styles.profileDetailContainer}>
          <p className={styles.profileLabel}>API Key</p>
          <input
            className={styles.profileInput}
            type="text"
            value={apiKey}
            onChange={handleApiKeyChange}
          />
        </div>
        <div className={styles.profileDetailContainer}>
          <p className={styles.profileLabel}>Threads</p>
          <Button onClick={handleThreads}>OPEN</Button>
        </div>
      </div>
    </Modal>
  );
};

export default Profile;
