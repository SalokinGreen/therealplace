import React, { use, useState, useEffect } from "react";
import styles from "./Threads.module.css";
import Modal from "../UI/Modal";
import Button from "../UI/Button";

const Thread = ({
  open,
  setOpen,
  threads,
  setThreads,
  threadsList,
  setThreadsList,
  activeThread,
  setActiveThread,
}) => {
  const [currentThread, setCurrentThread] = useState(threads[0]);
  useEffect(() => {
    setCurrentThread(threads.find((thread) => thread.key === activeThread));
  }, [activeThread]);
  const handleAddThread = () => {
    const newThread = {
      name: "NAME",
      key: randomKey(),
      id: randomId(),
      tags: "[ Search: ; Tags: ; Thread: ]",
      description: "Description",
      post: "@example: example",
      search: "SEARCH RESULTS FOR: New Thread\n@example: example",
      custom: true,
    };
    console.log(newThread);
    // add the object to the object "threads"

    // add the object to the array "threadsList"
    setThreadsList((prev) => {
      return [...prev, newThread];
    });
    // set the new thread as the active thread
  };
  const handleBlur = (e, key) => {
    let string = e.target.innerHTML;
    string = string.replace(/<div>/g, "\n");
    string = string.replace(/<\/div>/g, "");
    string = string.replace(/<br>/g, "\n");
    string = string.replace(/<\/br>/g, "");
    string = string.replace(/&nbsp;/g, " ");
    string = string.replace(/<p>/g, "");
    string = string.replace(/<\/p>/g, "");
    string = string.replace(/<span>/g, "");
    string = string.replace(/<\/span>/g, "");
    string = string.replace(/<br\/>/g, "");
    string = string.replace(/<br \/>/g, "");
    string = string.replace(/<br>/g, "");
    string = string.replace(/<br \/>/g, "");
    string = string.replace(/<br\/>/g, "");
    setThreads((prev) => {
      return prev.map((thread) => {
        if (thread.key === activeThread) {
          thread[key] = string;
        }
        return thread;
      });
    });
  };
  return (
    <Modal size="medium" isOpen={open} onClose={() => setOpen(false)}>
      <div className={styles.threads}>
        <div className={styles.list}>
          {/* <h2>Threads</h2> */}
          {threadsList.map((thread) => {
            return (
              <div
                className={styles.threadLI}
                key={thread.id}
                onClick={() => setActiveThread(thread.key)}
              >
                {thread.name}
              </div>
            );
          })}
          <div className={styles.threadLI} onClick={() => handleAddThread()}>
            + Add Thread
          </div>
        </div>
        <div className={styles.thread}>
          <div className={styles.threadRow}>
            <h3>Name</h3>
            <div
              className={
                threads.find((thread) => thread.key === activeThread).custom
                  ? styles.threadInput
                  : styles.threadInputNoEdit
              }
              contentEditable={
                threads.find((thread) => thread.key === activeThread).custom
              }
              style={{ whiteSpace: "pre-line" }}
              suppressContentEditableWarning
              dangerouslySetInnerHTML={{
                __html: threads.find((thread) => thread.key === activeThread)
                  .name,
              }}
              onBlur={(e) => {
                handleBlur(e, "name");
              }}
            ></div>
          </div>

          <div className={styles.threadRow}>
            <h3>Description</h3>
            <div
              className={
                threads.find((thread) => thread.key === activeThread).custom
                  ? styles.threadInput
                  : styles.threadInputNoEdit
              }
              contentEditable={
                threads.find((thread) => thread.key === activeThread).custom
              }
              suppressContentEditableWarning
              style={{ whiteSpace: "pre-line" }}
              dangerouslySetInnerHTML={{
                __html: threads.find((thread) => thread.key === activeThread)
                  .description,
              }}
              onBlur={(e) => {
                handleBlur(e, "description");
              }}
            ></div>
          </div>
          <div className={styles.threadRow}>
            <h3>Post</h3>
            <div
              className={
                threads.find((thread) => thread.key === activeThread).custom
                  ? styles.threadInput
                  : styles.threadInputNoEdit
              }
              contentEditable={
                threads.find((thread) => thread.key === activeThread).custom
              }
              style={{ whiteSpace: "pre-line" }}
              suppressContentEditableWarning
              dangerouslySetInnerHTML={{
                __html: threads.find((thread) => thread.key === activeThread)
                  .post,
              }}
              onBlur={(e) => {
                handleBlur(e, "post");
              }}
            ></div>
          </div>
          <div className={styles.threadRow}>
            <h3>Search</h3>
            <div
              className={
                threads.find((thread) => thread.key === activeThread).custom
                  ? styles.threadInput
                  : styles.threadInputNoEdit
              }
              contentEditable={
                threads.find((thread) => thread.key === activeThread).custom
              }
              suppressContentEditableWarning
              style={{ whiteSpace: "pre-line" }}
              dangerouslySetInnerHTML={{
                __html: threads.find((thread) => thread.key === activeThread)
                  .search,
              }}
              onBlur={(e) => {
                handleBlur(e, "search");
              }}
            ></div>
          </div>
          <div className={styles.threadRow}>
            <h3>Search Tags</h3>
            <div
              className={
                threads.find((thread) => thread.key === activeThread).custom
                  ? styles.threadInput
                  : styles.threadInputNoEdit
              }
              contentEditable={
                threads.find((thread) => thread.key === activeThread).custom
              }
              suppressContentEditableWarning
              style={{ whiteSpace: "pre-line" }}
              dangerouslySetInnerHTML={{
                __html: threads.find((thread) => thread.key === activeThread)
                  .searchTags,
              }}
              onBlur={(e) => {
                handleBlur(e, "searchTags");
              }}
            ></div>
          </div>
          <div className={styles.threadRow}>
            <h3>Post Tags</h3>
            <div
              className={
                threads.find((thread) => thread.key === activeThread).custom
                  ? styles.threadInput
                  : styles.threadInputNoEdit
              }
              contentEditable={
                threads.find((thread) => thread.key === activeThread).custom
              }
              suppressContentEditableWarning
              style={{ whiteSpace: "pre-line" }}
              dangerouslySetInnerHTML={{
                __html: threads.find((thread) => thread.key === activeThread)
                  .postTags,
              }}
              onBlur={(e) => {
                handleBlur(e, "postTags");
              }}
            ></div>
          </div>
          {threads.find((thread) => thread.key === activeThread).custom && (
            <div className={styles.threadRow}>
              <h3>Delete</h3>
              <Button
                onClick={() => {
                  setThreadsList((prev) => {
                    return prev.filter((thread) => thread.key !== activeThread);
                  });
                  setActiveThread(threadsList[0].key);
                }}
              >
                DELETE
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
export default Thread;

const randomKey = () => {
  return Math.random().toString(36).substring(2, 15);
};
const randomId = () => {
  return Math.random().toString(36).substring(2, 15);
};
