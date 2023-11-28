import React, { useState } from "react";

// style
import styles from "./Profile.module.css";
const Profile = ({
  setOpenProfile,
  username,
  setUsername,
  apiKey,
  setApiKey,
}) => {
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleApiKeyChange = (event) => {
    setApiKey(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform any necessary actions with the username and API key
    console.log("Username:", username);
    console.log("API Key:", apiKey);
  };

  return (
    <div className={styles.profileContainer}>
      <p className={styles.exitButton} onClick={() => setOpenProfile(false)}>
        X
      </p>
      <h2 className={styles.profileH2}>Profile</h2>
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
      </div>
    </div>
  );
};

export default Profile;
