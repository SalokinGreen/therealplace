import React, { useEffect, useState, useRef } from "react";

// style
import styles from "./Post.module.css";
export default function Post({
  title,
  tags,
  author,
  sub,
  subs,
  generate,
  buildContext,
  openPost,
  setOpenPost,
  attg,
  n,
  setN,
  username,
  generating,
  setGenerating,
}) {
  const [posts, setPosts] = useState([]);
  const [lastTitle, setLastTitle] = useState("");
  const [color, setColor] = useState("white");
  const [comment, setComment] = useState("");

  const generateComments = async (add, gens, gn) => {
    let oldN = n + gn;

    const context = buildContext(
      "post",
      subs[sub],
      posts,
      {
        title,
        author,
        tags: attg.tags,
        nsfw: attg.nsfw,
        thread: attg.thread,
      },
      subs
    );
    console.log(context);
    let appendString = "";
    if (posts.length === 0 && author !== username) {
      appendString = `${author}:`;
    }
    for (let i = 0; i < gens; i++) {
      await generate(context + add + appendString, 1)
        .then((res) => {
          console.log(res);
          res.forEach((element) => {
            // format: "@user: content"
            if (element.includes(":")) {
              let parts = element.split(":");
              const user = parts.shift();
              let content = parts.join(":").slice(1);
              // check if last char is @ in content and remove it
              if (content[content.length - 1] === "@") {
                content = content.slice(0, -2);
              }
              const post = {
                content: content,
                user: user,
                n: oldN,
              };
              setPosts((prev) => [...prev, post]);
              appendString += `${user}: ${content}\n@`;
            } else {
              let content = element.slice(1);
              // check if last char is @ in content and remove it
              if (content[content.length - 1] === "@") {
                content = content.slice(0, -2);
              }
              setPosts((prev) => [...prev, { user: author, content, n: oldN }]);
              appendString += `${author}: ${content}\n@`;
            }
            oldN++;
          });
          setN(oldN);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setGenerating(false);

    return true;
  };
  const deletePost = (post) => {
    setPosts((prev) => prev.filter((p) => p !== post));
    sortPosts();
  };
  const sortPosts = () => {
    // sort posts by n, lowest to highest
    posts.sort((a, b) => a.n - b.n);
    console.log(posts);
  };
  const handlePost = (ps) => {
    if (generating) {
      return;
    }
    let newComment = comment;
    if (comment === "" && (ps === undefined || ps === "")) {
      handleGenerate("", 3, 0);
      sortPosts();
      return;
    } else if (ps !== undefined) {
      newComment = ps;
    }
    setPosts((prev) => [...prev, { user: username, content: newComment, n }]);
    handleGenerate(`${username}: ${newComment}\n@`, 3, 1);
    setComment("");
    setN((prev) => prev + 1);
    // sort posts by n
    sortPosts();
  };
  const handleEnter = (e) => {
    if (generating) {
      e.preventDefault();
    }
    if (e.key === "Enter") {
      e.preventDefault();
      handlePost(e.target.innerHTML);
    }
  };
  const handleGenerate = (add, gens, gn) => {
    if (generating) {
      return;
    }
    setGenerating(true);
    generateComments(add, gens, gn);
    // compare both objects.content in posts and remove the shorter string
  };
  useEffect(() => {
    if (lastTitle !== title) {
      setPosts([]);
      setN(0);
    }
    setLastTitle(title);
  }, [title, lastTitle, setN]);
  // Come up with a better way to generate posts on open
  // useEffect(() => {
  //   posts.length === 0 && !generating && openPost && author !== username
  //     ? handleGenerate(author + ":", 1, 0)
  //     : null;
  // }, [openPost, author, generating, handleGenerate, posts.length, username]);
  useEffect(() => {
    if (generating) {
      color === "white" ? setColor("green") : setColor("white");
    }
  }, [generating]);
  useEffect(() => {
    sortPosts();
  }, [posts]);
  const postRef = useRef(null);

  useEffect(() => {
    if (openPost) {
      postRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [openPost, posts]);
  return (
    <div className={`${styles.post}`}>
      <div className={`${styles.postHeader}`} onClick={() => setOpenPost()}>
        <div className={`${styles.postTitleDiv}`}>
          <h1 className={`${styles.postTitle}`}>{title}</h1>
        </div>
        <p className={`${styles.author}`}>@{author}</p>
      </div>
      <div className={`${styles.commentsDiv}`}>
        {posts.map((post) => (
          <div className={`${styles.comment}`} key={post.n}>
            <p
              className={`${styles.commentAuthor}`}
              onClick={() => deletePost(post)}
            >
              @{post.user}
            </p>
            <div
              className={`${styles.commentText}`}
              contentEditable
              suppressContentEditableWarning
              dangerouslySetInnerHTML={{ __html: post.content }}
              onBlur={(e) => {
                post.content = e.target.innerHTML;
              }}
            ></div>
          </div>
        ))}
        <div className={`${styles.bottom}`} ref={postRef}></div>
      </div>
      <div className={`${styles.writeArea}`}>
        <div
          className={`${styles.writeInput}`}
          contentEditable
          suppressContentEditableWarning
          dangerouslySetInnerHTML={{ __html: comment }}
          onBlur={(e) => {
            setComment(e.target.innerHTML);
          }}
          onKeyDown={(e) => handleEnter(e)}
        ></div>
        <button
          className={
            generating ? styles.writeButtonGenerating : styles.writeButton
          }
          onClick={() => handlePost()}
        >
          Post
        </button>
      </div>
    </div>
  );
}
