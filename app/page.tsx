"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [word, setWord] = useState("");
  // data holds the fetched dictionary data
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(false);

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

  const onSubmit = (e) => {
    if (e.key === "Enter") {
      setSearch(true);
    }
  };
  

  return (
    <div>
      <input 
        type="text" 
        onChange={(e) => setWord(e.target.value)}
        onKeyDown={onSubmit}
        value={word} 
        placeholder="Type a word..."
      />
      <button onClick={handleClick}>Click</button>
      {loading && <p>Loading...</p>}
      {/* data checks if the data is fetched and if it is not null and data.length checks if there is at least 1 value, then it will map the data and display it */}
      {/* If both previous conditions are true (i.e., data is not null and has at least one element), data.map is executed. */}
      {data && data.length > 0 && (
        <div>
          <h1>{data[0].word}</h1>
          {data[0].phonetics && data[0].phonetics.length > 0 && (
            <p>{data[0].phonetics[0].text}</p>
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
