"use client";
import React, { useEffect, useState, useRef, use } from "react";
import axios from "axios";

// icons
import { FaSearch, FaPenNib } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";

// styles
import styles from "./Home.module.css";

// components
import SearchResult from "./SearchResult";
import Post from "./Post";
import Profile from "./Profile";
import Chip from "../UI/Chip";
import Thread from "./Thread";
// utils
import buildContext from "../../../util/buildContext";
import SubBox from "./SubBox";
function HomePage({ openProfile, setOpenProfile }) {
  const [searchText, setSearchText] = useState("");
  const [oldSearchText, setOldSearchText] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [sub, setSub] = useState("aita");
  const [openPost, setOpenPost] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [tags, setTags] = useState([]);
  const [author, setAuthor] = useState("");
  const [username, setUsername] = useState("Green");
  const [apiKey, setApiKey] = useState("");
  const [nsfw, setNsfw] = useState(false);
  const [title, setTitle] = useState("");
  const [pn, setPn] = useState(0);
  const [sn, setSn] = useState(0);
  const [generating, setGenerating] = useState(false);

  const [openThreads, setOpenThreads] = useState(false);

  const [threads, setThreads] = useState([]);
  useEffect(() => {
    const customThreads = threads.filter((t) => t.custom);
    if (customThreads.length > 0) {
      localStorage.setItem("customThreads", JSON.stringify(customThreads));
    }
  }, [threads]);

  useEffect(() => {
    // Turn the subs object into an array
    const threadsArray = Object.values(subs);
    // Set the threads state to the array
    console.log(threadsArray);
    if (localStorage.getItem("customThreads")) {
      // if there are, set the threads state to the custom threads
      const customThreads = JSON.parse(localStorage.getItem("customThreads"));
      console.log(customThreads);
      setThreads((prev) => [...threadsArray, ...customThreads]);
    } else {
      setThreads(threadsArray);
    }
  }, []);
  const [attg, setAttg] = useState({
    search: searchText,
    title: title,
    tags: tags,
    author: author,
    thread:
      threads.find((element) => element.key === sub) &&
      threads.find((element) => element.key === sub).name,
    nsfw: nsfw,
  });
  useEffect(() => {
    setAttg({
      search: searchText,
      title: title,
      tags: tags,
      author: author,
      thread:
        threads.find((element) => element.key === sub) &&
        threads.find((element) => element.key === sub).name,
      nsfw: nsfw,
    });
  }, [searchText, tags, author, sub, nsfw, title]);
  useEffect(() => {
    // sort posts by n
    setSearchResults((prev) => {
      return prev.sort((a, b) => b.n - a.n);
    });
  }, [searchResults]);
  useEffect(() => {
    // check if the username and API key are in local storage
    // if they are, set the state to the values from local storage
    if (localStorage.getItem("TRPusername")) {
      setUsername(localStorage.getItem("TRPusername"));
    }
    if (localStorage.getItem("TRPapiKey")) {
      setApiKey(localStorage.getItem("TRPapiKey"));
    }
  }, []);
  async function handleSearch(e) {
    e.preventDefault();
    setOpenPost(false);
    let context;
    if (searchText !== oldSearchText) {
      setSearchResults([]);
      setOldSearchText(searchText);
      context = [];
      setSn(0);
    } else {
      context = searchResults;
    }
    setSearchPerformed(true);
    const rar = buildContext(
      "search",
      threads.find((s) => s.key === sub),
      context,
      attg,
      threads
    );
    console.log(rar);
    setGenerating(true);
    for (let I = 0; I < 3; I++) {
      const responses = await generate(rar, 1);
      console.log(responses);
      responses.forEach((element) => {
        // format: "@user: content"
        const user = element.split(":")[0];
        let content = element.split(":")[1].slice(1);
        // check if last char is @ in content and remove it
        if (content[content.length - 1] === "@") {
          content = content.slice(0, -2);
        }
        const post = {
          content: content,
          user: user,
          n: sn,
        };
        setSearchResults((prev) => [...prev, post]);
        setSn((prev) => prev + 1);
      });
    }
    setGenerating(false);
  }
  async function generate(input, gens) {
    const response = await axios.post(
      "api/generate",
      {
        context: input,
        key: apiKey,
        gens,
        model: "kayra-v1",
        //   parameters: params,
      },
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response);
    return response.data.results;
  }
  function click(post) {
    console.log(post);
  }
  function handleOpenPost(title, tags, author) {
    setTitle(title);
    // setTags(tags);
    setAuthor(author);
    setOpenPost(true);
    setSearchPerformed(true);
  }
  const bottomRef = useRef(null);
  useEffect(() => {
    bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [searchResults]);

  return (
    <div>
      <div className={`${styles.Home}`}>
        <div
          className={searchPerformed ? styles.searchDivAfter : styles.searchDiv}
        >
          <div className={`${styles.searchDivRow1}`}>
            <input
              type="text"
              placeholder="Search"
              className={`${styles.searchInput}`}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearch(e);
                }
              }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className={
                generating
                  ? styles.searchSearchButtonGenerating
                  : styles.searchSearchButton
              }
            >
              <FaSearch />
            </button>
            <button
              className={`${styles.searchWriteButton}`}
              onClick={() => handleOpenPost(searchText, tags, username)}
            >
              <FaPenNib />
            </button>
            <button
              className={`${styles.searchProfileButton}`}
              onClick={() => setOpenProfile(true)}
            >
              <CgProfile />
            </button>
          </div>
          <div className={`${styles.searchDivRow2}`}>
            <div className={`${styles.searchDivRow2Col1}`}>
              <div
                className={`${styles.nsfwSwitch}`}
                onClick={() => setNsfw(!nsfw)}
              >
                {nsfw ? (
                  <div className={`${styles.nsfwLabel}`}>NSFW</div>
                ) : (
                  <div className={`${styles.nsfwLabel}`}>SFW</div>
                )}
              </div>
            </div>
            <div className={`${styles.searchDivRow2Col2}`}>
              <input
                type="text"
                placeholder="Tags"
                className={`${styles.tagsInput}`}
                onKeyPress={(e) => {
                  if (
                    e.key === "Enter" &&
                    tagsText !== "" &&
                    tags.length < 10
                  ) {
                    setTags((prev) => [...prev, tagsText]);
                    setTagsText("");
                  }
                }}
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
              />
            </div>
            <div className={`${styles.searchDivRow2Col2}`}>
              <SubBox subsArray={threads} sub={sub} setSub={setSub} />
            </div>
          </div>
          <div className={`${styles.searchDivRow3}`}>
            {tags.map((tag, key) => (
              <Chip
                key={key}
                text={tag}
                click={() => {
                  setTags((prev) => prev.filter((t) => t !== tag));
                }}
              />
            ))}
          </div>
        </div>
        {!openPost && (
          <div className={`${styles.searchResults}`}>
            {searchResults.map((post, key) => (
              <SearchResult post={post} key={key} click={handleOpenPost} />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
        {openPost && (
          <Post
            title={title}
            author={author}
            sub={sub}
            subs={threads}
            generate={generate}
            buildContext={buildContext}
            openPost={openPost}
            setOpenPost={setOpenPost}
            attg={attg}
            n={pn}
            setN={setPn}
            username={username}
            generating={generating}
            setGenerating={setGenerating}
          />
        )}
      </div>

      {/* Profile */}
      {openProfile && (
        <Profile
          username={username}
          setUsername={setUsername}
          apiKey={apiKey}
          setApiKey={setApiKey}
          openProfile={openProfile}
          setOpenProfile={setOpenProfile}
          setOpenThreads={setOpenThreads}
        />
      )}

      {/* Threads */}
      {openThreads && (
        <Thread
          open={openThreads}
          setOpen={setOpenThreads}
          threads={threads}
          setThreads={setThreads}
          threadsList={threads}
          setThreadsList={setThreads}
          activeThread={sub}
          setActiveThread={setSub}
        />
      )}
    </div>
  );
}

export default HomePage;

const subs = {
  aita: {
    name: "Am I The Asshole? (AITA)",
    key: "aita",
    description: `Am I the Asshole (AITA) is a thread where people post specific personal stories seeking judgment from the community about whether they were wrong or 'the asshole' in various conflicts or situations. Each post typically includes detailed accounts of interpersonal conflicts, misunderstandings, or moral dilemmas. Users respond by voting and commenting, using specific acronyms like YTA (You're The Asshole), NTA (Not The Asshole), ESH (Everyone Sucks Here), or NAH (No Assholes Here) to indicate their verdict. The thread encourages honest but respectful feedback, providing a platform for people to gain outside perspectives on their behavior and choices.`,
    search: `SEARCH RESULTS
@Ok-History: AITA for "outshining" the bride?
@HelloYou47: AITA for expecting accountability for RSVP (it's a trope by this point, isn't it?)
@PityParty: Am I the asshole for wanting to be everyone's moral compass?
@PrettyBoyXD: Am I the asshole for declining an invitation to a wedding because it's impossible for you to attend?
@SimplyTheBest: AITA for replacing your dress with a more expensive one at the bridal shop?`,
    searchTags:
      "[ Search: Wedding; Tags: wedding, guest; Thread: Am I the Asshole? (AITA) ]",
    postTags:
      '[ Author: @Ok-History; Title: AITA for "outshining" the bride?; Tags: wedding, guest; Thread: Am I the Asshole? (AITA) ]',
    post: `@Ok-History: So my younger cousin is getting married, to a great guy, I think they will be happy together. It was fun helping arrange the wedding, the niece is so cute (8 yrs). Anyway, my mom mentioned me in a toast at the reception, because I was one of the two people paying for the entire cost of the wedding. My cousin is a professional with a good salary, but which comes from parents with decent money. In fact, one reason we're close is that I'm also living off my parents. She was going to pay for a wedding on her own, but I pointed out she had always wanted to travel, and if she saved up a down-payment on a house, she'd be killing two birds with one stone.
Problem is, she told other relatives, who are now all like "wow, what a good guy" and stuff. Now I don't want her to have to pay me back or anything, but I guess... now I look like a better person than her? And she's the one getting married. I guess I am getting some attention because of it, but she's been complaining on how she's "just the daughter, not as important as the son/son-in-law". I can tell she's genuinely hurt by this. But I guess I would rather she pay her dues than get gold-digging complimented.
@JustAFarmer: No. You were trying to help your cousin and you succeeded. They do tend to look down on women in your culture for whatever reason, so the attention you're getting is not entirely undeserved, but yes, it's aimed towards the wrong person.
@TreeOfLife: That's gotta suck, the cousin should be the one receiving all the compliments. Still, I'm pretty sure they're all going to remember you as the one paying for the wedding, not just the other person.
@BobTheRoss: Shut up @JustAFarmer, not everyone shares your opinion. She had the right to act like that.
@Yes-You-Can-Notice-Sex: Fuck off @BobTheRoss, what is your problem?`,
    id: 0,
    custom: false,
  },
  ask: {
    name: "Ask Community",
    key: "ask",
    description: `Ask Community is a platform where individuals pose questions on a wide range of topics, seeking insights and experiences from the broader community. Questions can range from practical advice and personal experiences to seeking opinions on complex issues. Users from diverse backgrounds share their knowledge, opinions, and personal stories in response, fostering a space for learning and diverse perspectives.`,
    searchTags:
      "[ Search: How to cook meth; Tags: chemistry, illegal, guide; Thread: Ask Community ]",
    postTags:
      "[ Author: @GujcestLuvr; Title: How do I cook meth?; Tags: chemistry, illegal, guide; Thread: Ask Community ]",
    search: `SEARCH RESULTS
@GujcestLuvr: How do I cook meth?
@BodyHeat69: Guide to cooking meth!
@DumbDump: Is it legal to cook meth?
@Remember99: Should I let my wife try meth?
@HerpesUpYourAss: Do you cook meth while high on meth?`,
    post: `@GujcestLuvr: Hi everyone, I recently had a dream about cooking meth and I really want to make it a reality. How do I cook meth?
@ShootFromYourHip: Wear gloves. Always wear gloves.
@BurningBricks: Make sure not to have windows. Have fans to aerate the room though because otherwise, the smell is horrific and will attract police. If you are wanting to be somewhere with an audience, a school is a good place because there are constantly classes taking place.
@CherryBlossom101: Mix the chemicals gently and evenly, no matter the type or quantity. If the temperature gets too high, the process will become useless.
@HardHitters: Don't use open flames to cook, just use water baths. That's where the name comes from.`,
    id: 1,
    custom: false,
  },
  til: {
    name: "Today I Learned",
    key: "til",
    description:
      "Today I Learned (TIL) features posts where users share interesting and often little-known facts or information that they've recently discovered. The focus is on sharing knowledge and intriguing trivia, with an emphasis on verified and accurate information. Users contribute by discussing, adding additional details, or sharing related experiences, creating an environment of continuous learning and discovery.",
    searchTags: "[ Search: Blank; Tags: sfw; Thread: Today I Learned ]",
    postTags:
      "[ Author: @BobismySenpai; Search: TIL that a popcorn kernel contains enough energy to break a human bone.; Tags: sfw; Thread: Today I Learned ]",
    search: `SEARCH RESULTS
@PhilosophizeWith: TIL that in some states, you don't have to worry about getting a speeding ticket if you are driving a police car.
@FutureEmails: TIL that any line of text can become bold by starting the line with a * and ending it with an asterisk.
@BobismySenpai: TIL that a popcorn kernel contains enough energy to break a human bone.`,
    post: `@BobismySenpai: TIL that a popcorn kernel contains enough energy to break a human bone. First century Romans would throw corn on the coals of their fireplaces, causing it to explode and they enjoyed the popping sound it made.
@Trick-or-Treat: I don't believe that. You must be joking, or a liar!
@WhatIsUp: No, it is true. My grandmother eats popcorn every day and I've seen her break her arm and leg from it.
@ImABored: Why didn't you stop her? Also, how would a kernel break bones?
@WhatIsUp: POPCORN IS HER LIFE SOURCE. If she doesn't eat it every single day, she will die.`,
    id: 2,
    custom: false,
  },
  schreckNet: {
    name: "SchreckNet",
    key: "schreckNet",
    description: `SchreckNet is a clandestine online network exclusively designed for vampires, particularly Nosferatu, within the World of Darkness. It acts as a vital communication hub, enabling vampires from across the globe to share information, strategize, and stay connected while maintaining their secrecy in the supernatural world. This digital sanctuary is essential for vampires to manage their affairs, exchange knowledge, and uphold their hidden society amidst the complexities of their nocturnal existence.`,
    search: `SEARCH RESULTS
@Blackductape: Did Dracula walk among us?
@IAm127: Dracula was real.
@Needles: Are any of my comrades from the Struggle against Dracula still alive?
@TheOther0ne: Looking for Dracula's grandchilde
@CentuarWars: Dracula the undead...`,
    post: `@Blackductape: Hey there, I'm a new Cainite and I was wondering if there is a possibility that Dracula was real?
@Nicktoons: First of all, thank you for joining our community. We always need more Nosferatu. About your question, yes, there are a few historical figures that actually were real, but we only know through the whispers. Dracula may have been one of them.
@CreepsMcGee: According to the 300 year old diaries, someone named Vlad Tepes, was a cruel and ruthless ruler. Very much a Vanheim style of thing.
@IncoherentQ: Anyone have proof besides horror stories?
@Nicktoons: Play your cards right and maybe one day you'll have access to it.`,
    searchTags: `[ Search: Dracula; Tags: sfw, historical figure; Thread: SchreckNet ]`,
    postTags:
      "[ Author: @Blackductape; Title: Did Dracula walk among us?; Tags: sfw, historical figure; Thread: SchreckNet ]",
    id: 3,
    custom: false,
  },
  worldNews: {
    name: "World News",
    key: "worldNews",
    description: `World News is dedicated to sharing and discussing current events and major news stories from around the globe. Users post links to news articles from various sources, fostering discussions and debates about international politics, conflicts, developments, and crises. The thread serves as a hub for staying informed about global events and for understanding diverse perspectives on these issues.`,
    search: `SEARCH RESULTS
@fbMirrored: world war 5 will be an AI war.
@LORDhasRisen: Has anyone heard anything about this 'World War' we're supposed to be in?
@BadBoop: Reasons why we shouldn't be afraid of an imminent World War.
@CHIPS: Can't believe I survived 4 world wars.
@SaleLeft: Somebody tell me why the heck there is a World War happening.`,
    post: `@fbMirrored: I read a recently released report on the probability of the next world war being an AI war. As expected, things are looking grim.
@Suggestive-Lesbian: Really, can't people stop fighting anymore? There's no reason to kill each other for land.
@Bitchboi13: Oh, don't be a hypocrite. What else are people supposed to do? They were born for war.
@Miss-Cool: I have nothing but good feelings about the coming future. I've always known that we would be in danger because of machines, but I'm prepared for what is to come.
@Karen: Yeah, right. I'm so happy that we are heading towards artificial intelligence. If you haven't noticed, we are a dying species, and that's not a bad thing. We can't go on like this, we have ruined the earth.`,
    searchTags: `[ Search: World War; Tags: war, AI; Thread: World News ]`,
    postTags:
      "[ Author: @fbMirrored; Title: World war 5 will be an AI war; Tags: sfw, good news; Thread: World News ]",
    id: 4,
    custom: false,
  },
  ama: {
    name: "Ask Me Anything (AMA)",
    key: "ama",
    description: `Ask Me Anything is a community where individuals from all walks of life, including celebrities, experts in various fields, and people with unique experiences, invite others to ask them questions. These sessions are often insightful, covering a wide range of topics depending on the background of the person hosting the AMA. The format encourages open dialogue and provides a unique opportunity for community members to engage directly with people they might not otherwise have access to, gaining perspectives and knowledge on diverse subjects. This community is known for its candid conversations and the sharing of personal stories and professional insights.`,
    search: `SEARCH RESULTS
@BeautifulQuizine: AMA I'm a trained killer.
@WhatTheFIsThat: AMA I consume a deadly amount of Drugs every day.
@Friendship_is_Foreskin: AMA My boyfriend and I are not at all a normal couple.
@BooksAreForBarbarians: AMA I'm a serial killer that targets readers.
@BossGod1999: Ask me anything I'm a combat medic.`,
    post: `@BeautifulQuizine: Hello there, my name is John Doe. I'm a trained killer. Any questions? I'm willing to talk about anything.
@IRegretEverything: What made you want to kill? Was it fear or an insatiable lust for blood?
@BeautifulQuizine: Mostly boredom. It was either become a killer or a prostitute. My morals made me choose the former.
@SpeedyBoi: How do you kill your victims?
@BeautifulQuizine: Headshots all the way. Helps me gain easy access to their brains.`,
    searchTags: `[ Search: dangerous; Tags: sfw, unique; Thread: Ask Me Anything (AMA) ]`,
    postTags:
      "[ Author: @BeautifulQuizine; Title: AMA I'm a trained killer.; Tags: sfw, unique; Thread: Ask Me Anything (AMA) ]",
    id: 5,
    custom: false,
  },
};
