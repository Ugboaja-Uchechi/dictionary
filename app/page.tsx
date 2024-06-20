"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import { RiBook2Line } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";
import { BsMoon } from "react-icons/bs";
import { FaAngleDown } from "react-icons/fa6";
import { IoMdPlay } from "react-icons/io";
import { IoPauseSharp } from "react-icons/io5";
import { FiExternalLink } from "react-icons/fi";
import Link from "next/link";
import { ClipLoader } from "react-spinners";
import { HiOutlineEmojiSad } from "react-icons/hi";

export default function Home() {
  const [word, setWord] = useState("");
  // data holds the fetched dictionary data
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [fontFamily, setFontFamily] = useState({
    fontName: "Serif"
  })
  const [dropDown, setDropDown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [theme, setTheme] = useState("light");
  const inactiveTheme = theme === "light" ? "dark" : "light";

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);


  useEffect(() => {
    const fetchDictionary = async () => {
      if (search && word) {
        setLoading(true);
        try {
          const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
          const result = await res.json();
          setData(result);
        } catch (error) {
          console.error("Error fetching the dictionary data:", error);
          setData(null);
        }
        setLoading(false);
        setSearch(false);
      }
    };

    fetchDictionary();
  }, [search, word]);

  const onSubmit = (e: { key: string; }) => {
    if (e.key === "Enter") {
      setSearch(true);
    }
  };

  const handleClick = () => {
    setSearch(true);
    data
  };

  // const handleToggle = (audioUrl: string) => {
  //   //checks if there is a current audio playing. If currentAudio is null, this condition will be false, and the block will be skipped.
  //   if (currentAudio) {
  //     //if audio exists it pauses it
  //     currentAudio.pause();
  //     //checks if the URL of the currently playing audio (currentAudio.src) is the same as the URL passed to the handleToggle function (audioUrl).
  //     if (currentAudio.src === audioUrl) {
  //       //If the URLs match, it sets currentAudio to null, indicating that no audio is playing. It then returns immediately, exiting the function. This prevents the code from creating a new Audio object and starting playback again.    
  //       setCurrentAudio(null);
  //       return;
  //     }
  //   }
  //   //If there is no currently playing audio or the URLs do not match, it creates a new Audio object using the audioUrl passed to the function.
  //   const newAudio = new Audio(audioUrl);
  //   //The newly created Audio object is played.
  //   newAudio.play();
  //   //The currentAudio state is updated to the newly created Audio object. This indicates that this new audio is now the currently playing audio.
  //   setCurrentAudio(newAudio);
  // };

  const handlePlay = (audioUrl: string) => {
    const newAudio = new Audio(audioUrl);
    newAudio.play();
    setCurrentAudio(newAudio);
  };

  const toggleTheme = () => {
    setTheme(inactiveTheme);
  };

  // another way to update the font is to spread the current state (fontFamily) into a new object and then update/overwrite the fontName property.
  // using setFontFamily({...fontFamily, fontName}) is more robust and flexible, as it preserves other properties that might exist in the state object.

  const handleFontChange = (fontName: string) => {
    const cssVarName = fontName.toLowerCase().replace(" ", "-");
    document.documentElement.style.setProperty('--current-font-family', `var(--${cssVarName})`);
    setFontFamily({ fontName });
    setDropDown(false);
    console.log("font", fontFamily)
  };


  useEffect(() => {
    const handleDropDownClick = (event: any) => {
      //dropdownRef.current: Refers to the DOM element associated with dropdownRef.
      //!dropdownRef.current.contains(event.target): Checks if the clicked element is not inside the dropdownRef element.
      //event.target.id !== 'font': Ensures the clicked element does not have an ID of 'font'
      //event.target.alt !== '': Ensures the clicked element does not have an empty alt attribute.
      //If all these conditions are met, setDropDown(false) is called to close the dropdown.

      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) && event.target.id !== 'font' && event.target.alt !== ''
      ) {
        setDropDown(false)
      }
    };
    document.addEventListener("mousedown", handleDropDownClick);

    // a cleanup function that removes the event listener when the component unmounts or before re-running the effect.
    return () => {
      document.removeEventListener("mousedown", handleDropDownClick);
    };
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <RiBook2Line className={styles.book} />
        </div>
        <div className={styles.headFlex}>
          <div className={styles.dropdowncontainer}>
            <div className={styles.dropdownCover} ref={dropdownRef}>
              <span
                id="font"
                onClick={() =>
                  setDropDown((prevOpen) => !prevOpen)
                }
              >
                {fontFamily.fontName}
              </span>
              <div
                className={styles.downContainer}
                onClick={() =>
                  setDropDown((prevOpen) => !prevOpen)
                }
              >
                <FaAngleDown className={styles.down} />
              </div>
            </div>
            {dropDown && (
              <div ref={dropdownRef}>
                <p
                  onClick={() => handleFontChange("Serif")}
                >
                  Serif
                </p>
                <p
                  onClick={() => handleFontChange("Sans")}
                >
                  Sans-Serif
                </p>
                <p
                  onClick={() => handleFontChange("Montserrat")}
                >
                  Montserrat
                </p>
              </div>
            )}
          </div>

          <div
            onClick={toggleTheme}
            className={`${theme === 'light' ? "grey" : "purple"} ${styles.theme}`}
          >
            <span
              className={`${theme === 'light' ? 'notranslate' : 'translate'} ${styles.circle}`}
            />
          </div>

          <div>
            <BsMoon className={styles.moon} />
          </div>
        </div>

      </div>


      <div className={styles.inputContainer}>
        <input
          type="text"
          onChange={(e) => setWord(e.target.value)}
          onKeyDown={onSubmit}
          value={word}
          placeholder="Search a word..."
          className={styles.input}
        />

        <div className={styles.searchCover} onClick={handleClick}>
          <CiSearch className={styles.search} />
        </div>
      </div>

      {loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ClipLoader
            color={"#a334ed"}
            size={30}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>

      ) : (
        <>
          {data && data.length > 0 && (
            <div>
              <div className={styles.flex}>
                <div>
                  <h1 className={styles.word}>{data[0].word}</h1>
                  {data[0].phonetics && data[0].phonetics.length > 0 && (
                    data[0].phonetics.map((phonetic, index) => (
                      <div key={index}>
                        <p className={styles.phonics}>{phonetic.text}</p>

                      </div>
                    ))
                  )}
                </div>

                <div onClick={() => data[0]?.phonetics[0] && handlePlay(data[0].phonetics[0].audio)} className={styles.playIconCover}>
                  {data[0]?.phonetics[0]?.audio && (
                    <div>
                      <IoMdPlay className={styles.playIcon} />
                    </div>
                  )}
                </div>

              </div>

              {data.map(item => (
                item.meanings.map((meaning, index) => (
                  <div key={index}>
                    <div className={styles.speechContainer}>
                      <h2 className={styles.speech}>{meaning.partOfSpeech}</h2>
                      <div className={styles.hr}>
                        <hr />
                      </div>

                    </div>
                    <div style={{ marginBlock: "1rem", }}>
                      <h3 className={styles.meaning}>Meaning</h3>
                      {meaning.definitions.map((definition, defIndex) => (
                        <ul key={defIndex} className={styles.list}>

                          <li>{definition.definition}</li>
                        </ul>

                      ))}

                      {meaning.synonyms && meaning.synonyms.length > 0 && (
                        <div className={styles.speechContainer} style={{ marginTop: "1.5rem", }}>
                          <h3 className={styles.text}>Synonyms</h3>
                          <p className={styles.synonym}>{meaning.synonyms.join(" ")}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ))}

              <div className={styles.hr} style={{ marginTop: "2.5rem", marginBottom: "1.5rem" }}>
                <hr />
              </div>

              <div
                className={styles.speechContainer}
                style={{ marginBottom: "4rem" }}
              >
                <h4 className={styles.source}>Source</h4>
                <div>
                  <Link href={`${data[0]?.sourceUrls}`} target="blank" className={styles.linkContainer}>{data[0]?.sourceUrls}
                    <FiExternalLink className={styles.linkIcon} />
                  </Link>

                </div>
              </div>
            </div>
          )}
          {!search && data && (
            <div className={styles.errorContainer}>
              <div className={styles.errorIcon}>
                😓
              </div>
              <p className={styles.errorMsg}>{data?.message} {data?.resolution}</p>
            </div>

          )}
        </>
      )}
      {/* data checks if the data is fetched and if it is not null and data.length checks if there is at least 1 value, then it will map the data and display it */}
      {/* If both previous conditions are true (i.e., data is not null and has at least one element), data.map is executed. */}

    </div>
  );
}
