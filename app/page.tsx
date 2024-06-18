"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { RiBook2Line } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";
import { BsMoon } from "react-icons/bs";
import { FaAngleDown } from "react-icons/fa6";
import { IoMdPlay } from "react-icons/io";
import { IoPauseSharp } from "react-icons/io5";

export default function Home() {
  const audio = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
  const [word, setWord] = useState("");
  // data holds the fetched dictionary data
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);

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

  return (
    <div>
      <div>
        <RiBook2Line />
      </div>
      <div>
        <FaAngleDown />
      </div>
      <div>
        <BsMoon />
      </div>
      <button onClick={toggleTheme} className={`${!theme ? "light" : "dark"}`}>{!theme ? "light" : "dark"}</button>

      <div>
        <input
          type="text"
          onChange={(e) => setWord(e.target.value)}
          onKeyDown={onSubmit}
          value={word}
          placeholder="Type a word..."
        />
        <CiSearch />
      </div>

      <button onClick={handleClick}>Click</button>
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
                        ) }
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
