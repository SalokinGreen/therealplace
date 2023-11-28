import React, { Component } from "react";

// style
import styles from "./Home.module.css";

export default function SearchResult({ post, key, click }) {
  return (
    <div
      className={`${styles.searchResult}`}
      onClick={() => click(post.content, post.tags, post.user)}
    >
      <div className={`${styles.searchResultUp}`}>
        <h2 className={`${styles.searchResultTitle}`}>{post.content}</h2>
        <p className={`${styles.searchResultAuthor}`}>@{post.user}</p>
      </div>
      {/* <div className={`${styles.searchResultDown}`}>
        <p className={`${styles.searchResultContent}`}>{post.content}</p>
      </div> */}
    </div>
  );
}
