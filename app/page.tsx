"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import { RiBook2Line } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";
import { BsMoon } from "react-icons/bs";
import { FaAngleDown } from "react-icons/fa6";
import { IoMdPlay } from "react-icons/io";
import { IoPauseSharp } from "react-icons/io5";

export default function Home() {
  const [word, setWord] = useState("");
  // data holds the fetched dictionary data
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [fontFamily, setFontFamily] = useState({
    fontName: "Serif"
  })
  const [dropDown, setDropDown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [theme, setTheme] = useState(false);

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

  const handleClick = () => {
    setSearch(true);
    data
    console.log(data);
  };

  const onSubmit = (e: { key: string; }) => {
    if (e.key === "Enter") {
      setSearch(true);
    }
  };


  const handleToggle = (audioUrl: string) => {
    //checks if there is a current audio playing. If currentAudio is null, this condition will be false, and the block will be skipped.
    if (currentAudio) {
      //if audio exists it pauses it
      currentAudio.pause();
      //checks if the URL of the currently playing audio (currentAudio.src) is the same as the URL passed to the handleToggle function (audioUrl).
      if (currentAudio.src === audioUrl) {
        //If the URLs match, it sets currentAudio to null, indicating that no audio is playing. It then returns immediately, exiting the function. This prevents the code from creating a new Audio object and starting playback again.    
        setCurrentAudio(null);
        return;
      }
    }
    //If there is no currently playing audio or the URLs do not match, it creates a new Audio object using the audioUrl passed to the function.
    const newAudio = new Audio(audioUrl);
    //The newly created Audio object is played.
    newAudio.play();
    //The currentAudio state is updated to the newly created Audio object. This indicates that this new audio is now the currently playing audio.
    setCurrentAudio(newAudio);
  };

  const toggleTheme = () => {
    setTheme(!theme);
  };

  // another way to update the font is to spread the current state (fontFamily) into a new object and then update/overwrite the fontName property.
  // using setFontFamily({...fontFamily, fontName}) is more robust and flexible, as it preserves other properties that might exist in the state object.

  const handleFontChange = (fontName: string) => {
    setFontFamily({ fontName })
    setDropDown(false);
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
              <div
                className="absolute z-10 top-full w-full bg-white rounded-xl shadow-lg py-3 border border-[#eaeaed]"
              >
                <div
                  onClick={() => handleFontChange("Serif")}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-euclid text-sm font-normal text-[#0e0e0e] border-b border-b-[#eaeaed]"
                >
                  Serif
                </div>
                <div
                  onClick={() => handleFontChange("Sans-Serif")}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-euclid text-sm font-normal text-[#0e0e0e] border-b border-b-[#eaeaed]"
                >
                  Sans-Serif
                </div>
                <div
                  onClick={() => handleFontChange("Montserrat")}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-euclid text-sm font-normal text-[#0e0e0e]"
                >
                  Montserrat
                </div>
              </div>
            )}
          </div>



          <div
            onClick={toggleTheme}
            className={`${!theme ? "grey" : "purple"} ${styles.theme}`}
          >
            <span
              className={`${theme ? 'translate' : 'notranslate'} ${styles.circle}`}
            />
          </div>

          <div>
            <BsMoon />
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

        <div className={styles.searchCover}>
          <CiSearch className={styles.search} />
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {/* data checks if the data is fetched and if it is not null and data.length checks if there is at least 1 value, then it will map the data and display it */}
      {/* If both previous conditions are true (i.e., data is not null and has at least one element), data.map is executed. */}
      {data && data.length > 0 && (
        <div>
          <h1>{data[0].word}</h1>
          {data[0].phonetics && data[0].phonetics.length > 0 && (
            data[0].phonetics.map((phonetic, index) => (
              <div key={index}>
                <p>{phonetic.text}</p>
                {phonetic.audio && (
                  <button onClick={() => handleToggle(phonetic.audio)}>
                    {currentAudio && currentAudio.src === phonetic.audio ? (
                      <div>
                        <IoPauseSharp />
                      </div>
                    ) : (
                      <div>
                        <IoMdPlay />
                      </div>
                    )}
                  </button>
                )}
              </div>
            ))
          )}

          {data.map(item => (
            item.meanings.map((meaning, index) => (
              <div key={index}>
                <h2>{meaning.partOfSpeech}</h2>
                {meaning.definitions.map((definition, defIndex) => (
                  <p key={defIndex}>{definition.definition}</p>
                ))}
                <p>{meaning.synonyms}</p>
              </div>
            ))
          ))}
        </div>
      )}
      {!search && data && (
        <>
          <p>{data?.message}</p>
          <p>{data?.resolution}</p>
        </>

      )}
    </div>
  );
}
