import React, { useEffect, useState } from "react";

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
}) {
  const [posts, setPosts] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [lastTitle, setLastTitle] = useState("");
  const [color, setColor] = useState("white");
  const [comment, setComment] = useState("");
  useEffect(() => {
    if (lastTitle !== title) {
      setPosts([]);
      setN(0);
    }
    setLastTitle(title);
  }, [title]);
  useEffect(() => {
    posts.length === 0 && !generating && openPost && author !== username
      ? handleGenerate(author + ":", 1, 0)
      : null;
  }, [openPost]);
  useEffect(() => {
    if (generating) {
      color === "white" ? setColor("green") : setColor("white");
    }
  }, []);
  useEffect(() => {
    sortPosts();
  }, [posts]);
  const handleGenerate = (add, gens, gn) => {
    if (generating) {
      return;
    }
    setGenerating(true);
    generateComments(add, gens, gn);
    // compare both objects.content in posts and remove the shorter string
  };

  const generateComments = (add, gens, gn) => {
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
    generate(context + add, gens).then((res) => {
      console.log(res);
      setGenerating(false);
      res.forEach((element) => {
        // format: "@user: content"
        if (element.includes(":")) {
          const user = element.split(":")[0];
          let content = element.split(":")[1].slice(1);
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
        } else {
          let content = element.slice(1);
          // check if last char is @ in content and remove it
          if (content[content.length - 1] === "@") {
            content = content.slice(0, -2);
          }
          setPosts((prev) => [...prev, { user: author, content, n: oldN }]);
        }
        oldN++;
      });
      setN(oldN);
    });

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
    let newComment = comment;
    if (comment === "" && ps === undefined) {
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
    if (e.key === "Enter") {
      e.preventDefault();
      handlePost(e.target.innerHTML);
    }
  };

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
          <div className={`${styles.comment}`}>
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
        {/* <div className={`${styles.more}`}>
          <h2
            className={`${styles.moreText} ${styles[color]}`}
            onClick={() => handleGenerate("", 3)}
          >
            #More
          </h2>
        </div> */}
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
          className={`${styles.writeButton}`}
          onClick={() => handlePost()}
        >
          Post
        </button>
      </div>
    </div>
  );
}
