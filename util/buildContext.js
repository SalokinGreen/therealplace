export default function buildContext(type, sub, context, attg, subs) {
  let returnString = "";
  let n = 0;
  let usedSubs = [];
  usedSubs.push(sub.id);
  returnString += "";
  returnString += sub["tags"] + "\n";
  returnString += "Thread Description: " + sub["description"] + "\n***\n";
  returnString += sub[type] + "\n";
  let subsArray = Object.values(subs);
  while (n < 1) {
    console.log(subsArray);
    const randomSubIndex = Math.floor(Math.random() * subsArray.length);
    console.log(randomSubIndex);
    let newSub = subsArray[randomSubIndex];
    console.log(newSub);
    if (!usedSubs.includes(newSub.id)) {
      usedSubs.push(sub.id);
      returnString += "⁂\n";
      returnString += newSub["tags"] + "\n";
      returnString +=
        "Thread Description: " + newSub["description"] + "\n***\n";
      returnString += newSub[type] + "\n";
      n++;
    }
  }
  returnString += "⁂\n";

  //   add attg
  returnString += "[ ";
  type === "search" ? null : (returnString += "Author: @" + attg.author + "; ");
  type === "search"
    ? (returnString += "Search: " + attg.search + "; ")
    : (returnString += "Title: " + attg.title + "; ");
  returnString += "Tags: ";
  console.log(attg.tags);
  attg.nsfw ? (returnString += "nsfw, ") : (returnString += "sfw, ");
  if (attg.tags.length > 0) {
    attg.tags.forEach((tag) => {
      returnString += tag + ", ";
    });
  }
  returnString = returnString.slice(0, -2);
  returnString += "; ";
  returnString += "Thread: " + attg.thread + "; ]\n";

  returnString += "Thread Description: " + sub["description"] + "\n***\n";
  type === "search" ? (returnString += "SEARCH RESULTS\n") : null;
  //   build later the logic for token measurment by using a second array and filling it from the bottom to top.
  const reversedContext = context.reverse();
  let cparts = "";
  context.forEach((post) => {
    cparts = `@${post.user}: ${post.content}\n` + cparts;
  });
  returnString += cparts;
  returnString += "@"; // this is to make sure the last post is not cut off
  return cleanString(returnString);
}

function cleanString(string) {
  // remove white spaces
  while (string.includes("\n\n")) {
    string = string.replace("\n\n", "\n");
  }
  string.replace(" \n", "\n");
  string.replace("\n ", "\n");
  while (string.includes("  ")) {
    string = string.replace("  ", " ");
  }
  string = string.trim();

  return string;
}
