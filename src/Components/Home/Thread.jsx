import React, { useState } from "react";
import styles from "./Threads.module.css";
import Modal from "../UI/Modal";

const Thread = ({ open, setOpen, threads }) => {
  return (
    <Modal size="big">
      <div className={styles.threads}>
        <h2>Threads</h2>
        {threads.map((thread) => {
          return (
            <div className={styles.thread} key={thread.id}>
              <div className={styles.threadTitle}>{thread.name}</div>
              <div className={styles.threadContent}>{thread.description}</div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};
export default Thread;
